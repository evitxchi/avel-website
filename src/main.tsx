import "../main.js"
import { createRoot } from "react-dom/client"
import { useLayoutEffect, useRef } from "react"
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
  focusLongitude: number
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
    focusLongitude: 265,
    airports: [airports.TEB, airports.ORD, airports.SFO],
    labelOffsets: [[-46, -27], [46, 25], [30, -20]],
    legs: [
      { from: airports.TEB, to: airports.ORD, depart: "08:15", arrive: "09:52", departDate: "2026-09-26", arriveDate: "2026-09-26", aircraft: "Citation Longitude", color: [0.93, 0.96, 1] },
      { from: airports.ORD, to: airports.SFO, depart: "10:35", arrive: "11:50", departDate: "2026-09-26", arriveDate: "2026-09-26", aircraft: "Citation Longitude", color: [0.68, 0.77, 0.87] },
    ],
  },
  {
    id: "pacific-crossing",
    focusLongitude: 200,
    airports: [airports.SFO, airports.HNL, airports.HND],
    labelOffsets: [[-42, -26], [0, 29], [42, -22]],
    legs: [
      { from: airports.SFO, to: airports.HNL, depart: "12:45", arrive: "15:30", departDate: "2026-09-26", arriveDate: "2026-09-26", aircraft: "Gulfstream G500", color: [0.78, 0.85, 0.93] },
      { from: airports.HNL, to: airports.HND, depart: "17:00", arrive: "21:30", departDate: "2026-09-26", arriveDate: "2026-09-27", aircraft: "Gulfstream G700", color: [0.88, 0.85, 0.93] },
    ],
  },
  {
    id: "east-asia",
    focusLongitude: 123,
    airports: [airports.HND, airports.ICN, airports.SIN],
    labelOffsets: [[-42, -25], [0, 29], [42, -21]],
    legs: [
      { from: airports.HND, to: airports.ICN, depart: "23:00", arrive: "00:45", departDate: "2026-09-27", arriveDate: "2026-09-28", aircraft: "Citation Longitude", color: [0.95, 0.91, 0.84] },
      { from: airports.ICN, to: airports.SIN, depart: "02:30", arrive: "08:50", departDate: "2026-09-28", arriveDate: "2026-09-28", aircraft: "Gulfstream G600", color: [0.73, 0.81, 0.89] },
    ],
  },
  {
    id: "asia-and-gulf",
    focusLongitude: 76,
    airports: [airports.SIN, airports.BOM, airports.DXB],
    labelOffsets: [[-42, -25], [0, 29], [42, -21]],
    legs: [
      { from: airports.SIN, to: airports.BOM, depart: "10:00", arrive: "12:00", departDate: "2026-09-28", arriveDate: "2026-09-28", aircraft: "Challenger 350", color: [0.91, 0.84, 0.73] },
      { from: airports.BOM, to: airports.DXB, depart: "14:00", arrive: "16:15", departDate: "2026-09-28", arriveDate: "2026-09-28", aircraft: "Challenger 350", color: [0.77, 0.88, 0.85] },
    ],
  },
  {
    id: "europe-and-gulf",
    focusLongitude: 19,
    airports: [airports.DXB, airports.CDG, airports.LHR],
    labelOffsets: [[42, -25], [0, 29], [-42, -22]],
    legs: [
      { from: airports.DXB, to: airports.CDG, depart: "17:30", arrive: "21:45", departDate: "2026-09-28", arriveDate: "2026-09-28", aircraft: "Citation Longitude", color: [0.73, 0.85, 0.93] },
      { from: airports.CDG, to: airports.LHR, depart: "23:00", arrive: "23:35", departDate: "2026-09-28", arriveDate: "2026-09-28", aircraft: "Citation Latitude", color: [0.92, 0.89, 0.84] },
    ],
  },
  {
    id: "atlantic-crossing",
    focusLongitude: 311,
    airports: [airports.LHR, airports.JFK, airports.TEB],
    labelOffsets: [[-45, -25], [0, 29], [45, -22]],
    legs: [
      { from: airports.LHR, to: airports.JFK, depart: "00:30", arrive: "03:45", departDate: "2026-09-29", arriveDate: "2026-09-29", aircraft: "Gulfstream G500", color: [0.85, 0.81, 0.92] },
      { from: airports.JFK, to: airports.TEB, depart: "05:15", arrive: "06:00", departDate: "2026-09-29", arriveDate: "2026-09-29", aircraft: "Citation Latitude", color: [0.72, 0.82, 0.92] },
    ],
  },
]

routeSets.sort((left, right) => left.focusLongitude - right.focusLongitude)

function markersFor(route: RouteSet): GlobeMarker[] {
  const activeLabels = new Map(route.airports.map((airport, index) => [airport.code, route.labelOffsets[index]]))
  return route.airports.map((airport) => ({
    id: `airport-${airport.code.toLowerCase()}`,
    location: airport.location,
    label: `${airport.code} · ${airport.city.toUpperCase()}`,
    labelOffset: activeLabels.get(airport.code),
  }))
}

function arcsFor(route: RouteSet): GlobeArc[] {
  return route.legs.map((leg, index) => ({
    id: `${route.id}-${index}`,
    from: leg.from.location,
    to: leg.to.location,
    color: leg.color,
    active: true,
  }))
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

const globeRoot = document.getElementById("network-globe-root")
const flightRailRoot = document.getElementById("flight-rail-root")
const assistantOrbRoot = document.getElementById("assistant-orb-root")
const setupThinkingOrbRoot = document.getElementById("setup-thinking-orb")
const globeSpeed = 0.001

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
  if (assistantOrbRoot) {
    createRoot(assistantOrbRoot).render(
      <ThinkingOrb
        state="solving"
        size={64}
        speed={0.65}
        paused={window.matchMedia("(prefers-reduced-motion: reduce)").matches}
      />,
    )
  }
  let activeRoute = 0
  let routeCycle = 0

  const showRoute = (routeIndex: number) => {
    const route = routeSets[routeIndex]
    globe.render(
      <Globe
        initialPhi={route.focusLongitude * Math.PI / 180}
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
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const advanceRoute = () => {
      const nextRoute = (activeRoute + 1) % routeSets.length
      const currentLongitude = routeSets[activeRoute].focusLongitude
      const nextLongitude = routeSets[nextRoute].focusLongitude + (nextRoute === 0 ? 360 : 0)
      const radiansToNextRoute = (nextLongitude - currentLongitude) * Math.PI / 180
      const travelDuration = radiansToNextRoute * 16.67 / globeSpeed

      window.setTimeout(() => {
        activeRoute = nextRoute
        if (activeRoute === 0) routeCycle += 1
        showRoute(activeRoute)
        advanceRoute()
      }, travelDuration)
    }

    advanceRoute()
  }
}
