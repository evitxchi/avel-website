export const overviewAircraft = [
  { name: "Gulfstream G650", image: "/assets/workflow-aircraft-g650.jpg", registration: "N650GU" },
  { name: "Global 6000", image: "/assets/workflow-aircraft-global6000.jpg", registration: "N555DT" },
  { name: "Gulfstream G550", image: "/assets/workflow-aircraft-g550.jpg", registration: "N41PM" },
] as const

/** Hold the first and last options briefly; use the existing aircraft-stage clock. */
export function aircraftScrollProgress(elapsed: number): number {
  if (Number.isNaN(elapsed)) return 0
  const progress = Math.max(0, Math.min(1, (elapsed - 500) / 1600))
  return progress * progress * (3 - 2 * progress)
}
