import "../main.js"
import { createRoot } from "react-dom/client"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { createElement as createLucideElement, Plane } from "lucide"
import { ThinkingOrb } from "thinking-orbs"
import { Globe } from "../components/ui/cobe-globe"
import type { GlobeArc, GlobeMarker } from "../components/ui/cobe-globe"

type Airport = {
  code: string
  city: string
  zone: string
  location: [number, number]
}

type FlightLeg = {
  from: Airport
  to: Airport
  depart: string
  arrive: string
  departDate: string
  arriveDate: string
  aircraft: string
  color: [number, number, number]
}

type RouteSet = {
  id: string
  airports: Airport[]
  labelOffsets: [number, number][]
  legs: FlightLeg[]
}

const airport = (
  code: string,
  city: string,
  zone: string,
  latitude: number,
  longitude: number,
): Airport => ({ code, city, zone, location: [latitude, longitude] })

const airports = {
  TEB: airport("TEB", "Teterboro", "EDT", 40.850219, -74.054897),
  ORD: airport("ORD", "Chicago", "CDT", 41.97694, -87.90815),
  SFO: airport("SFO", "San Francisco", "PDT", 37.618806, -122.375417),
  HNL: airport("HNL", "Honolulu", "HST", 21.318681, -157.922428),
  HND: airport("HND", "Tokyo", "JST", 35.5494, 139.7798),
  ICN: airport("ICN", "Seoul", "KST", 37.4602, 126.4407),
  SIN: airport("SIN", "Singapore", "SGT", 1.35019, 103.994),
  DXB: airport("DXB", "Dubai", "GST", 25.2532, 55.3657),
  BOM: airport("BOM", "Mumbai", "IST", 19.0896, 72.8656),
  LHR: airport("LHR", "London", "BST", 51.47, -0.4543),
  CDG: airport("CDG", "Paris", "CEST", 49.0097, 2.5479),
  JFK: airport("JFK", "New York", "EDT", 40.6413, -73.7781),
  MIA: airport("MIA", "Miami", "EDT", 25.7959, -80.287),
  LAX: airport("LAX", "Los Angeles", "PDT", 33.9416, -118.4085),
  SYD: airport("SYD", "Sydney", "AEST", -33.9399, 151.1753),
  AKL: airport("AKL", "Auckland", "NZST", -37.0082, 174.785),
  CPT: airport("CPT", "Cape Town", "SAST", -33.9700, 18.5960),
  GRU: airport("GRU", "São Paulo", "BRT", -23.4356, -46.4731),
  SCL: airport("SCL", "Santiago", "CLST", -33.3930, -70.7858),
}

const routeSets: RouteSet[] = [
  {
    id: "north-america",
    airports: [airports.TEB, airports.ORD, airports.SFO],
    labelOffsets: [[-46, -27], [46, 25], [30, -20]],
    legs: [
      { from: airports.TEB, to: airports.ORD, depart: "08:15", arrive: "09:52", departDate: "2026-09-26", arriveDate: "2026-09-26", aircraft: "Citation Longitude", color: [0.93, 0.96, 1] },
      { from: airports.ORD, to: airports.SFO, depart: "10:35", arrive: "11:50", departDate: "2026-09-26", arriveDate: "2026-09-26", aircraft: "Citation Longitude", color: [0.68, 0.77, 0.87] },
    ],
  },
  {
    id: "pacific-crossing",
    airports: [airports.SFO, airports.HNL, airports.HND],
    labelOffsets: [[-42, -26], [0, 29], [42, -22]],
    legs: [
      { from: airports.SFO, to: airports.HNL, depart: "12:45", arrive: "15:30", departDate: "2026-09-26", arriveDate: "2026-09-26", aircraft: "Gulfstream G500", color: [0.78, 0.85, 0.93] },
      { from: airports.HNL, to: airports.HND, depart: "17:00", arrive: "21:30", departDate: "2026-09-26", arriveDate: "2026-09-27", aircraft: "Gulfstream G700", color: [0.88, 0.85, 0.93] },
    ],
  },
  {
    id: "east-asia",
    airports: [airports.HND, airports.ICN, airports.SIN],
    labelOffsets: [[-42, -25], [0, 29], [42, -21]],
    legs: [
      { from: airports.HND, to: airports.ICN, depart: "23:00", arrive: "00:45", departDate: "2026-09-27", arriveDate: "2026-09-28", aircraft: "Citation Longitude", color: [0.95, 0.91, 0.84] },
      { from: airports.ICN, to: airports.SIN, depart: "02:30", arrive: "08:50", departDate: "2026-09-28", arriveDate: "2026-09-28", aircraft: "Gulfstream G600", color: [0.73, 0.81, 0.89] },
    ],
  },
  {
    id: "asia-and-gulf",
    airports: [airports.SIN, airports.BOM, airports.DXB],
    labelOffsets: [[-42, -25], [0, 29], [42, -21]],
    legs: [
      { from: airports.SIN, to: airports.BOM, depart: "10:00", arrive: "12:00", departDate: "2026-09-28", arriveDate: "2026-09-28", aircraft: "Challenger 350", color: [0.91, 0.84, 0.73] },
      { from: airports.BOM, to: airports.DXB, depart: "14:00", arrive: "16:15", departDate: "2026-09-28", arriveDate: "2026-09-28", aircraft: "Challenger 350", color: [0.77, 0.88, 0.85] },
    ],
  },
  {
    id: "europe-and-gulf",
    airports: [airports.DXB, airports.CDG, airports.LHR],
    labelOffsets: [[42, -25], [0, 29], [-42, -22]],
    legs: [
      { from: airports.DXB, to: airports.CDG, depart: "17:30", arrive: "21:45", departDate: "2026-09-28", arriveDate: "2026-09-28", aircraft: "Citation Longitude", color: [0.73, 0.85, 0.93] },
      { from: airports.CDG, to: airports.LHR, depart: "23:00", arrive: "23:35", departDate: "2026-09-28", arriveDate: "2026-09-28", aircraft: "Citation Latitude", color: [0.92, 0.89, 0.84] },
    ],
  },
  {
    id: "atlantic-crossing",
    airports: [airports.LHR, airports.JFK, airports.TEB],
    labelOffsets: [[-45, -25], [0, 29], [45, -22]],
    legs: [
      { from: airports.LHR, to: airports.JFK, depart: "00:30", arrive: "03:45", departDate: "2026-09-29", arriveDate: "2026-09-29", aircraft: "Gulfstream G500", color: [0.85, 0.81, 0.92] },
      { from: airports.JFK, to: airports.TEB, depart: "05:15", arrive: "06:00", departDate: "2026-09-29", arriveDate: "2026-09-29", aircraft: "Citation Latitude", color: [0.72, 0.82, 0.92] },
    ],
  },
]

function markersFor(route: RouteSet): GlobeMarker[] {
  const activeLabels = new Map(route.airports.map((airport, index) => [airport.code, route.labelOffsets[index]]))
  return Object.values(airports).map((airport) => ({
    id: `airport-${airport.code.toLowerCase()}`,
    location: airport.location,
    label: activeLabels.has(airport.code) ? `${airport.code} · ${airport.city.toUpperCase()}` : "",
    labelOffset: activeLabels.get(airport.code),
  }))
}

function arcsFor(route: RouteSet): GlobeArc[] {
  const itineraryArcs = routeSets.flatMap((set) => set.legs.map((leg, index) => ({
    id: `${set.id}-${index}`,
    from: leg.from.location,
    to: leg.to.location,
    color: leg.color,
    active: set.id === route.id,
  })))
  const networkArcs: GlobeArc[] = [
    { id: "network-sydney-auckland", from: airports.SYD.location, to: airports.AKL.location, color: [0.77, 0.83, 0.9] },
    { id: "network-auckland-honolulu", from: airports.AKL.location, to: airports.HNL.location, color: [0.91, 0.88, 0.8] },
    { id: "network-cape-town-sao-paulo", from: airports.CPT.location, to: airports.GRU.location, color: [0.78, 0.84, 0.91] },
    { id: "network-sao-paulo-santiago", from: airports.GRU.location, to: airports.SCL.location, color: [0.9, 0.83, 0.75] },
    { id: "network-santiago-los-angeles", from: airports.SCL.location, to: airports.LAX.location, color: [0.82, 0.85, 0.9] },
    { id: "network-miami-sao-paulo", from: airports.MIA.location, to: airports.GRU.location, color: [0.89, 0.84, 0.77] },
    { id: "network-cape-town-dubai", from: airports.CPT.location, to: airports.DXB.location, color: [0.77, 0.84, 0.85] },
    { id: "network-los-angeles-tokyo", from: airports.LAX.location, to: airports.HND.location, color: [0.83, 0.86, 0.92] },
  ]
  return [...itineraryArcs, ...networkArcs]
}

function distanceBetween(from: Airport, to: Airport): string {
  const radians = (degrees: number) => degrees * Math.PI / 180
  const [lat1, lon1] = from.location.map(radians)
  const [lat2, lon2] = to.location.map(radians)
  const haversine = Math.sin((lat2 - lat1) / 2) ** 2
    + Math.cos(lat1) * Math.cos(lat2) * Math.sin((lon2 - lon1) / 2) ** 2
  const nauticalMiles = Math.round(3440.065 * 2 * Math.asin(Math.sqrt(haversine)))
  return `${nauticalMiles.toLocaleString()} NM`
}

function displayDate(date: string, cycle: number): string {
  const value = new Date(`${date}T00:00:00Z`)
  value.setUTCDate(value.getUTCDate() + cycle * 4)
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(value)
}

function FlightRail({ route, cycle }: { route: RouteSet; cycle: number }) {
  return (
    <div key={`${route.id}-${cycle}`} className="flight-rail route-change">
      {route.legs.map((leg) => (
        <article className="flight-leg" key={`${leg.from.code}-${leg.to.code}`}>
          <div className="flight-heading">
            <b>{leg.from.city} to {leg.to.city}</b>
          </div>
          <div className="flight-times">
            <div className="flight-time">
              <small>Depart · {leg.from.code} · {leg.from.zone}</small>
              <strong>{leg.depart}</strong>
              <small>{displayDate(leg.departDate, cycle)}</small>
            </div>
            <FlightDirection />
            <div className="flight-time">
              <small>Arrive · {leg.to.code} · {leg.to.zone}</small>
              <strong>{leg.arrive}</strong>
              <small>{displayDate(leg.arriveDate, cycle)}</small>
            </div>
          </div>
          <div className="flight-meta">
            <span>{leg.aircraft}</span>
            <span>{distanceBetween(leg.from, leg.to)}</span>
          </div>
        </article>
      ))}
    </div>
  )
}

function FlightDirection() {
  const iconRoot = useRef<HTMLSpanElement>(null)
  useLayoutEffect(() => {
    if (iconRoot.current) iconRoot.current.replaceChildren(createLucideElement(Plane, { "aria-hidden": "true" }))
  }, [])
  return <span className="flight-direction" ref={iconRoot} aria-hidden="true" />
}

const agentSteps = [
  "Searching Avel project files",
  "Reviewing flight and fleet context",
  "Formulating route options",
  "Drafting a clear response",
]

function AssistantActivity() {
  const [step, setStep] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches)

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setReducedMotion(preference.matches)
    preference.addEventListener("change", update)
    return () => preference.removeEventListener("change", update)
  }, [])

  useEffect(() => {
    if (reducedMotion) return
    const timer = window.setInterval(() => setStep((current) => (current + 1) % agentSteps.length), 1900)
    return () => window.clearInterval(timer)
  }, [reducedMotion])

  const recentSteps = Array.from({ length: agentSteps.length }, (_, index) => {
    const stepIndex = (step - index + agentSteps.length) % agentSteps.length
    return { text: agentSteps[stepIndex], active: index === 0, key: `${stepIndex}-${step}` }
  })

  return (
    <div className="agent-activity" aria-label="Avel One activity">
      <div className="agent-activity-head">
        <span className="agent-orb"><ThinkingOrb state="solving" size={64} speed={0.8} paused={reducedMotion} /></span>
        <span className="agent-activity-title"><strong>Avel One</strong><small>Thinking through your request</small></span>
      </div>
      <ol className="agent-activity-feed" aria-live="polite">
        {recentSteps.map((item) => (
          <li className={item.active ? "is-current" : ""} key={item.key}>
            <span className="agent-activity-pulse" aria-hidden="true" />
            <span>{item.text}</span>
            {item.active && <small>Now</small>}
          </li>
        ))}
      </ol>
    </div>
  )
}

const globeRoot = document.getElementById("network-globe-root")
const flightRailRoot = document.getElementById("flight-rail-root")
const assistantActivityRoot = document.getElementById("assistant-activity-root")
const setupThinkingOrbRoot = document.getElementById("setup-thinking-orb")
const globeSpeed = 0.00125
const globeTurnMs = 2 * Math.PI * 16.67 / globeSpeed

if (setupThinkingOrbRoot) {
  createRoot(setupThinkingOrbRoot).render(
    <ThinkingOrb
      state="solving"
      size={64}
      speed={0.55}
      paused={window.matchMedia("(prefers-reduced-motion: reduce)").matches}
    />,
  )
}

if (globeRoot && flightRailRoot) {
  const globe = createRoot(globeRoot)
  const rail = createRoot(flightRailRoot)
  if (assistantActivityRoot) createRoot(assistantActivityRoot).render(<AssistantActivity />)
  let activeRoute = 0
  let routeCycle = 0

  const showRoute = (routeIndex: number) => {
    const route = routeSets[routeIndex]
    globe.render(
      <Globe
        markers={markersFor(route)}
        arcs={arcsFor(route)}
        markerColor={[0.97, 0.98, 1]}
        baseColor={[0.28, 0.29, 0.3]}
        arcColor={[0.94, 0.96, 0.99]}
        glowColor={[0.92, 0.94, 0.97]}
        dark={1}
        mapBrightness={6}
        markerSize={0.034}
        markerElevation={0.025}
        arcWidth={1.05}
        arcHeight={0.42}
        speed={globeSpeed}
        theta={0.22}
        scale={1.2}
        diffuse={1.2}
        mapPointCount={18000}
      />,
    )
    rail.render(<FlightRail route={route} cycle={routeCycle} />)
  }

  showRoute(activeRoute)
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) window.setInterval(() => {
    activeRoute = (activeRoute + 1) % routeSets.length
    if (activeRoute === 0) routeCycle += 1
    showRoute(activeRoute)
  }, globeTurnMs / routeSets.length)
}
