export type OverviewTrip = {
  from: string
  to: string
  fromCode: string
  toCode: string
  aircraft: string
  distance: string
  depart: string
  zone: string
}

export type OverviewFrame = {
  phase: "request" | "context" | "aircraft" | "coordination" | "ready"
  beat: 0 | 1
  phaseElapsed: number
  questionWords: number
}

export type OverviewStatus = {
  label: string
  status: string
  state: "pending" | "active" | "done"
}

export const overviewDuration = 12100

const phases = [
  { phase: "request", start: 0 },
  { phase: "context", start: 1600 },
  { phase: "aircraft", start: 4100 },
  { phase: "coordination", start: 6600 },
  { phase: "ready", start: 9100 },
] as const

/** A finite, clamped clock that can be sampled or rewound without retained state. */
export function overviewFrame(elapsed: number, reducedMotion = false): OverviewFrame {
  const time = reducedMotion ? overviewDuration : Number.isNaN(elapsed) ? 0 : Math.min(overviewDuration, Math.max(0, elapsed))
  let current: (typeof phases)[number] = phases[0]
  for (const entry of phases) if (time >= entry.start) current = entry
  const phaseElapsed = time - current.start
  return {
    phase: current.phase,
    beat: current.phase === "ready" || phaseElapsed >= 1000 ? 1 : 0,
    phaseElapsed,
    // The view slices the actual question, so multiword cities reveal naturally.
    questionWords: current.phase === "request" ? Math.min(40, 1 + Math.floor(time / 40)) : 40,
  }
}

export function overviewQuestion(trip: OverviewTrip): string {
  return `Can you prepare a trip from ${trip.from} to ${trip.to} for 6 guests, checking aircraft options, crew availability, and ground services for review?`
}

/** These are demonstration drafts, with no booking or operational approval implied. */
export function overviewStatuses(frame: OverviewFrame): [OverviewStatus, OverviewStatus, OverviewStatus] {
  const phaseIndex = phases.findIndex((entry) => entry.phase === frame.phase)
  const items = [
    { label: "Trip context", working: ["Reading trip request", "Assembling trip context"], done: "Trip context drafted" },
    { label: "Aircraft options", working: ["Comparing aircraft options", "Drafting aircraft shortlist"], done: "Aircraft shortlist drafted" },
    { label: "Crew & ground", working: ["Preparing service requests", "Assembling coordination notes"], done: "Coordination notes drafted" },
  ]
  return items.map((item, index) => {
    const step = index + 1
    const state = phaseIndex > step ? "done" : phaseIndex === step ? "active" : "pending"
    return {
      label: item.label,
      status: state === "done" ? item.done : state === "active" ? item.working[frame.beat] : "Pending",
      state,
    }
  }) as [OverviewStatus, OverviewStatus, OverviewStatus]
}
