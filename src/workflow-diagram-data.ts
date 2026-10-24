import type { WorkflowStep } from "./workflow-state"

export type WorkflowFigure = "hub" | "drawer" | "relay" | "stack" | "loupe" | "settle" | "format"
export type WorkflowDiagram = {
  figure: WorkflowFigure
  title: string
  description: string
  facts: [string, string][]
}

const diagrams: Record<string, WorkflowDiagram> = {
  sales: {
    figure: "hub", title: "One connected request.",
    description: "Email, WhatsApp, and phone, matched to one trip.",
    facts: [["Route", "TEB → APF"], ["Guests", "6 passengers"]],
  },
  maintenance: {
    figure: "drawer", title: "Aircraft history, together.",
    description: "The pilot report and prior records, linked to the aircraft.",
    facts: [["Aircraft", "N724AV"], ["Report", "Cabin trim"]],
  },
  inspection: {
    figure: "relay", title: "Inspection, coordinated.",
    description: "The discrepancy reaches the team that can resolve it.",
    facts: [["Assigned", "Maintenance"], ["Next", "Confirm window"]],
  },
  crew: {
    figure: "relay", title: "One departure. Every team.",
    description: "Pilots, dispatch, and the FBO share the same update.",
    facts: [["Departure", "10:30 local"], ["Guests", "6 passengers"]],
  },
  review: {
    figure: "stack", title: "Changes, ready to review.",
    description: "Aircraft, timing, and terms come together for your decision.",
    facts: [["Schedule", "Later departure"], ["Decision", "Your team"]],
  },
  booking: {
    figure: "loupe", title: "Acceptance, verified.",
    description: "The client's reply is checked against the accepted quote.",
    facts: [["Quote", "$48,600"], ["Guests", "6 passengers"]],
  },
  recovery: {
    figure: "settle", title: "Find the path forward.",
    description: "Trip requirements shape the search for a replacement.",
    facts: [["Route", "TEB → APF"], ["Departure", "Keep the time"]],
  },
  billing: {
    figure: "format", title: "Every charge, in order.",
    description: "Supplier invoices are matched to the completed trip.",
    facts: [["Flight", "$51,000"], ["Extras", "Under review"]],
  },
}

export function diagramForStep(key: string, step: WorkflowStep): WorkflowDiagram | undefined {
  return diagrams[key === "maintenance" && step.kind === "working" && step.task === 1 ? "inspection" : key]
}
