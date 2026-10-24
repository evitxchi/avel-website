import type { WorkflowStep } from "./workflow-state"

export type PreviewKind = "diagram" | "aircraft" | "quote" | "work-order" | "messages" | "brief" | "comparison" | "agreement" | "payment" | "reconcile" | "invoice"

/** Visual work stays on the same task clock as the rest of the demonstration. */
export function previewForStep(key: string, step: WorkflowStep): PreviewKind | null {
  const task = step.kind === "complete" ? Infinity : step.task
  switch (key) {
    case "sales": return task < 1 ? "diagram" : task < 2 ? "aircraft" : "quote"
    case "maintenance": return task < 2 ? "diagram" : "work-order"
    case "crew": return task === 2 && step.kind === "working" && step.beat === 0 ? "diagram" : task < 2 ? "messages" : "brief"
    case "review": return task === 2 && step.kind === "working" && step.beat === 0 ? "diagram" : task < 1 ? "aircraft" : "comparison"
    case "booking": return task < 1 ? "diagram" : task < 2 ? "agreement" : "payment"
    case "recovery": return task < 1 ? "diagram" : task < 2 ? "aircraft" : task < 3 ? "comparison" : "messages"
    case "billing": return task < 1 ? "diagram" : task < 2 ? "reconcile" : "invoice"
    default: return null
  }
}

export function previewIsApproved(key: string, step: WorkflowStep): boolean {
  if (!["review", "recovery", "billing"].includes(key)) return false
  return step.kind === "complete" || step.kind === "approved" || (step.kind === "working" && step.task > 2)
}

export function paymentIsReceived(step: WorkflowStep): boolean {
  return step.kind === "complete" || (step.kind === "working" && (step.task > 2 || (step.task === 2 && step.beat > 0)))
}

export const billingFigures = {
  flight: 51000,
  catering: 420,
  transport: 380,
  duplicate: 650,
  received: 48600,
}
export const finalBillTotal = billingFigures.flight + billingFigures.catering + billingFigures.transport
export const finalBillBalance = finalBillTotal - billingFigures.received
