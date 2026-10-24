import { useEffect, useRef } from "react"
import { createRoot } from "react-dom/client"
import { ModuleControls, ModuleFigure, ModuleIcon, useModuleSequence } from "./module-motion"
import { flightPosition } from "./module-sequence"
import "./coordination-flight.css"

const stations = [
  { name: "Specialists aligned", detail: "Sales, crew, and operations share the same trip context.", figure: "rebuild", icon: "users", caption: "Defined roles" },
  { name: "Systems connected", detail: "Communication and aircraft records meet in one workspace.", figure: "exploded", icon: "link", caption: "Connected systems" },
  { name: "Conversation carried forward", detail: "The latest request and every revision stay with the trip.", figure: "terminal", icon: "message-circle", caption: "Shared conversation" },
  { name: "The plan, ready for review", detail: "A complete brief brings the next decision to your team.", figure: "riffle", icon: "file-text", caption: "Reviewable plan" },
] as const

const routePath = Array.from({ length: 65 }, (_, i) => {
  const x = 100 + i * 12.5
  return `${i ? "L" : "M"}${x} ${128 - Math.sin(i / 64 * Math.PI * 2) * 18}`
}).join(" ")

/** A small aircraft model, with separate cabin, swept wings, nacelles and tail. */
export function LineAircraft() {
  return <g className="coordination-aircraft-model" fill="#0b0d10" strokeLinejoin="round" strokeLinecap="round">
    <path className="aircraft-edge" d="M-11-3-58-52-35-52 28-5Z" />
    <path className="aircraft-edge" d="M-72-1-93-26-79-26-48-3Z" />
    <path className="aircraft-crease" d="M-39-47 5-6M-81-21-62-3" fill="none" />
    <path className="aircraft-edge" d="M-44 3Q-53-1-56-6L-44-11 13-8Q25-8 28-3L21 3Z" />
    <path className="aircraft-crease" d="M-49-5 14-4Q20-4 22-2" fill="none" />
    <path className="aircraft-edge" d="M-74 8Q-86 6-89 1L-64-7 66-5Q89-4 104 7Q89 16 65 16L-57 19Q-70 17-74 8Z" />
    <path className="aircraft-crease" d="M-72 5Q-49 10-27 10L90 8M-65 13 60 12" fill="none" />
    <path className="aircraft-edge" d="M-72 12-93 40-78 40-48 14Z" />
    <path className="aircraft-hi" d="M-9 13-56 64-31 65 31 14Z" />
    <path className="aircraft-crease" d="M-36 59 13 17M-82 35-62 16" fill="none" />
    <path className="aircraft-edge" d="M-68 6-62-25-51-26-41 8Z" />
    <path className="aircraft-crease" d="M-60-19-54 4" fill="none" />
    <path className="aircraft-hi" d="M-34 19Q-39 12-35 9L-26 6 15 8Q23 8 27 13L20 20Z" />
    <path className="aircraft-crease" d="M-32 12 14 13Q20 13 22 15M74 1 84 3 88 6 76 5Z" fill="none" />
    <path className="aircraft-crease" d="M-15 2-10 2M-4 2 1 2M7 2 12 2M18 2 23 2M29 2 34 2M40 2 45 2M51 2 56 2" fill="none" />
  </g>
}

export function CoordinationFlight() {
  const host = useRef<HTMLElement>(null)
  const motion = useModuleSequence(host, 4)
  const stage = stations[motion.step]
  const x = flightPosition(motion.step, motion.reduced ? 1 : motion.progress)
  const y = 128 - Math.sin((x - 100) / 800 * Math.PI * 2) * 18
  const fade = motion.reduced ? 1 : motion.step === 3 && motion.progress > .91 ? Math.max(0, (1 - motion.progress) / .09) : motion.step === 0 ? Math.min(1, motion.progress / .1) : 1
  useEffect(() => {
    const cards = host.current?.closest(".principles")?.querySelectorAll(".principle-card")
    cards?.forEach((card, index) => card.classList.toggle("is-flight-active", index === motion.step))
    return () => cards?.forEach(card => card.classList.remove("is-flight-active"))
  }, [motion.step])
  return <section ref={host} className="coordination-flight" data-step={motion.step} data-playing={motion.playing} aria-label="From connected teams to a reviewable flight plan">
    <div className="coordination-flight-stations">{stations.map((station, i) => <div key={station.name} className={i === motion.step ? "is-active" : ""}>
      <ModuleFigure kind={station.figure} beat={motion.step} playing={motion.playing && i === motion.step} theme="dark" /><span><ModuleIcon name={station.icon} size={13} />{station.caption}</span>
    </div>)}</div>
    <div className="coordination-flight-route"><svg viewBox="0 0 1000 250" role="img" aria-label="Aircraft moving through team alignment, connected systems, shared conversation, and a reviewable plan">
      <path className="coordination-route-base" d={routePath} fill="none" />
      <path className="coordination-route-travel" d={routePath} fill="none" pathLength="100" strokeDasharray={`${(x - 100) / 8} 100`} />
      {[100, 367, 633, 900].map((point, i) => <g key={point}><path className={`coordination-route-guide${i === motion.step ? " is-active" : ""}`} d={`M${point} 22V${i === 1 ? 106 : i === 2 ? 138 : 122}`} strokeDasharray="2 7" /><rect className={i <= motion.step ? "coordination-route-stop is-reached" : "coordination-route-stop"} x={point - 3} y={(i === 1 ? 112 : i === 2 ? 144 : 128) - 3} width="6" height="6" rx="1" /></g>)}
      <g transform={`translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(.62)`} opacity={fade}><LineAircraft /></g>
    </svg></div>
    <footer><div key={motion.step} className="module-demo-enter"><span className="module-demo-label">One connected operation</span><h3>{stage.name}</h3><p>{stage.detail}</p></div><ModuleControls paused={motion.paused} onPause={motion.togglePause} onReplay={motion.replay} label="coordination flight" reduced={motion.reduced} /></footer>
  </section>
}

const root = document.getElementById("coordination-flight")
if (root) createRoot(root).render(<CoordinationFlight />)
