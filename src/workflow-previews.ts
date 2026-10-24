import "./workflow-previews.css"
import { createElement, FileText, MessageCircle, ChevronDown, ArrowRight, Check, Plane } from "lucide"
import type { IconNode } from "lucide"
import type { WorkflowStep } from "./workflow-state"
import { previewForStep, previewIsApproved, paymentIsReceived, billingFigures, finalBillTotal, finalBillBalance } from "./workflow-preview-state"
import type { PreviewKind } from "./workflow-preview-state"

const glyph = (node: IconNode) => createElement(node, { "aria-hidden": "true", "stroke-width": 1.5 }).outerHTML
const money = (amount: number) => `$${amount.toLocaleString("en-US")}`
const logo = '<img class="fp-logo" src="/assets/avel-wordmark.png" alt="Avel" />'
const row = (label: string, value: string, className = "") => `<div class="fp-line ${className}"><span>${label}</span><span>${value}</span></div>`
const toolbar = (title: string) => `<div class="fp-toolbar">${glyph(FileText)}<span>${title}</span><span class="fp-filetype">PDF</span></div>`
const documentShell = (filename: string, title: string, content: string) => `${toolbar(filename)}<div class="fp-paper"><div class="fp-document-head">${logo}<strong>${title}</strong></div>${content}</div>`
const route = '<div class="fp-document-route"><span>Marina Alvarez</span><span>TEB → APF · 6 guests</span></div>'

function aircraft(key: string): string {
  const options = [
    { name: "Gulfstream G650", image: "g650", price: key === "recovery" ? 54600 : 48600, note: "Long-range cabin" },
    { name: "Global 6000", image: "global6000", price: 51000, note: "Same departure" },
  ]
  return `<div class="fp-aircraft-heading"><span>Aircraft options</span><span>TEB → APF · 6 guests</span></div><div class="fp-aircraft-window"><div class="fp-aircraft-track">${options.map((option) => `<div class="fp-aircraft-slide"><img class="fp-aircraft-photo" src="/assets/workflow-aircraft-${option.image}.jpg" alt="${option.name}" width="800" height="500" /><div class="fp-aircraft-copy"><small>${option.note}</small><strong>${option.name}</strong><span class="fp-aircraft-price">${money(option.price)}</span><small>Trip quote</small></div></div>`).join("")}</div></div><div class="fp-aircraft-footer"><span>${glyph(Plane)} Comparing operator responses</span><span class="fp-carousel-dots" aria-hidden="true"><i></i><i></i></span></div>`
}

function messages(key: string, task: number): string {
  const recovery = key === "recovery"
  const ground = key === "crew" && task === 1
  const title = ground ? "Teterboro FBO" : "Flight crew"
  const outgoing = recovery ? "Global 6000 confirmed. Same Naples departure. Updated brief attached." : ground ? "Departure is now 10:30. Please align fuel, catering, and handling for six guests." : "Departure moved to 10:30. TEB → Naples, six guests. Updated brief attached."
  const reply = recovery ? "Received. Crew and ground team have the update." : ground ? "Confirmed. All services are set for 10:30." : "Received. Both pilots are briefed for 10:30."
  return `<div class="fp-sms-header"><span class="fp-sms-app">${glyph(MessageCircle)}<span>${title}<small>Messages</small></span></span>${glyph(ChevronDown)}</div><div class="fp-chat"><p class="fp-bubble fp-outgoing">${outgoing}</p><div class="fp-delivered">Delivered</div><div class="fp-reply"><small>${ground ? "Handling desk" : "Capt. Jordan"}</small><p class="fp-bubble fp-incoming">${reply}</p></div></div>`
}

function documentPreview(kind: PreviewKind): string {
  switch (kind) {
    case "quote": return documentShell("Marina · charter proposal.pdf", "Charter proposal", `${route}${row("Gulfstream G650 · Thursday", "$48,600")}${row("Passenger party", "6 guests")}${row("Operator confirmation", "Requested")}${row("Proposed trip total", "$48,600", "fp-document-total")}`)
    case "agreement": return documentShell("Marina · charter agreement.pdf", "Charter agreement", `${route}${row("Agreed charter total", "$48,600")}${row("Itinerary & cancellation terms", "Included")}<div class="fp-signature"><span>Passenger signature</span><span class="fp-signature-name">Marina Alvarez</span><span class="fp-signature-status">Signature requested</span></div>`)
    case "invoice": return documentShell("Marina · final invoice.pdf", "Invoice AV-1048", `${route}${row("Flight incl. approved replacement", money(billingFigures.flight))}${row("Catering + ground transport", money(billingFigures.catering + billingFigures.transport))}${row("Trip total", money(finalBillTotal))}${row("Payment received", `−${money(billingFigures.received)}`)}${row("Balance due", money(finalBillBalance), "fp-document-total")}<span class="fp-document-stamp">Draft · awaiting review</span>`)
    case "work-order": return documentShell("N724AV · work order.pdf", "Work order WO-024", `<div class="fp-document-route"><span>N724AV</span><span>Cabin trim inspection</span></div>${row("Reported discrepancy", "Cabin vibration")}${row("Assigned to", "Maintenance team")}${row("Technician sign-off", "Received", "fp-document-total")}<div class="fp-document-note">Work order, sign-off, and invoice filed together.</div>`)
    case "brief": return documentShell("Marina · departure brief.pdf", "Departure brief", `${route}<div class="fp-brief-time"><span>Thursday departure</span><span><del>09:00</del>${glyph(ArrowRight)}<strong>10:30</strong></span></div>${row("Flight crew", "Both pilots briefed")}${row("Fuel · catering · handling", "Confirmed", "fp-document-total")}`)
    default: return ""
  }
}

function comparison(key: string): string {
  return `<div class="fp-toolbar">${glyph(FileText)}<span>Revised charter plan</span><span class="fp-filetype">Review</span></div><div class="fp-comparison"><div><small>Original quote</small><strong>$48,600</strong><span>${key === "review" ? "Current aircraft" : "Gulfstream G650"}</span></div>${glyph(ArrowRight)}<div><small>Replacement</small><strong>$51,000</strong><span>Global 6000</span></div></div><div class="fp-change-summary"><span>${key === "review" ? "Later departure" : "Same departure"} · six guests</span><strong>+$2,400</strong></div><div class="fp-approval-note">Prepared for your team’s approval</div>`
}

function payment(): string {
  return `<div class="fp-toolbar">${glyph(FileText)}<span>Marina · booking payment</span><span class="fp-payment-status">Request sent</span></div><div class="fp-payment-main"><span>Amount received</span><strong data-fp-received data-value="0">$0</strong><small>Booking AV-1048</small></div><div class="fp-payment-footer"><span>Outstanding <strong data-fp-outstanding data-value="48600">$48,600</strong></span><span class="fp-payment-matched">${glyph(Check)} Matched to trip</span></div>`
}

function reconcile(): string {
  return `<div class="fp-toolbar">${glyph(FileText)}<span>Matching supplier charges</span><span class="fp-filetype">3 items</span></div><div class="fp-reconcile-lines">${row("Catering", "$420")}${row("Ground transport", "$380")}${row("Handling · duplicate invoice", "$650", "fp-duplicate")}</div><div class="fp-reconcile-total"><span data-fp-charges-label>Charges under review</span><strong data-fp-charges data-value="1450">$1,450</strong></div>`
}

function render(kind: PreviewKind, key: string, task: number): string {
  if (kind === "aircraft") return aircraft(key)
  if (kind === "messages") return messages(key, task)
  if (kind === "payment") return payment()
  if (kind === "comparison") return comparison(key)
  if (kind === "reconcile") return reconcile()
  return documentPreview(kind)
}

function numberChange(element: HTMLElement | null, value: number, motion: boolean) {
  if (!element || element.dataset.value === String(value)) return
  const previous = Number(element.dataset.value ?? value)
  element.dataset.value = String(value)
  element.setAttribute("aria-label", money(value))
  element.innerHTML = motion ? `<span class="fp-number-window" aria-hidden="true"><span class="fp-number-roll"><span>${money(previous)}</span><span>${money(value)}</span></span></span>` : money(value)
}

/** All changes are derived from the main workflow clock: no independent loops or timers. */
export function updateWorkflowPreview(root: HTMLElement, key: string, step: WorkflowStep, motion: boolean): boolean {
  const kind = previewForStep(key, step)
  root.hidden = kind === null
  if (!kind) { root.replaceChildren(); root.removeAttribute("data-preview-id"); return false }
  const task = step.kind === "complete" ? Infinity : step.task
  const id = `${key}:${kind}:${kind === "messages" && key === "crew" ? task : ""}`
  if (root.dataset.previewId !== id) {
    root.dataset.previewId = id
    root.dataset.kind = kind
    root.innerHTML = render(kind, key, task)
    root.classList.remove("fp-enter")
    if (motion) { void root.offsetWidth; root.classList.add("fp-enter") }
  }
  const advanced = step.kind !== "working" || step.beat > 0
  root.classList.toggle("fp-static", !motion)
  root.classList.toggle("fp-advanced", advanced)
  root.classList.toggle("fp-approved", previewIsApproved(key, step))
  root.classList.toggle("fp-received", kind === "payment" && paymentIsReceived(step))
  root.classList.toggle("fp-issued", kind === "invoice" && step.kind === "complete")
  if (kind === "aircraft") {
    root.querySelector<HTMLElement>(".fp-aircraft-track")!.style.transform = `translateX(${advanced ? -100 : 0}%)`
    root.setAttribute("aria-label", advanced ? "Global 6000, trip quote $51,000" : `Gulfstream G650, trip quote ${key === "recovery" ? "$54,600" : "$48,600"}`)
  } else root.removeAttribute("aria-label")
  if (kind === "payment") {
    const received = paymentIsReceived(step)
    numberChange(root.querySelector("[data-fp-received]"), received ? 48600 : 0, motion)
    numberChange(root.querySelector("[data-fp-outstanding]"), received ? 0 : 48600, motion)
    root.querySelector(".fp-payment-status")!.textContent = received ? "Payment received" : "Verifying funds"
  }
  if (kind === "reconcile") {
    numberChange(root.querySelector("[data-fp-charges]"), advanced ? 800 : 1450, motion)
    root.querySelector("[data-fp-charges-label]")!.textContent = advanced ? "Verified extras · duplicate excluded" : "Charges under review"
  }
  if (kind === "invoice") root.querySelector(".fp-document-stamp")!.textContent = step.kind === "complete" ? "Issued · payment balance due" : previewIsApproved(key, step) ? "Approved · preparing final invoice" : "Draft · awaiting review"
  if (kind === "comparison") root.querySelector(".fp-approval-note")!.textContent = previewIsApproved(key, step) ? "Approved by Jordan · Operations" : "Prepared for your team’s approval"
  if (kind === "agreement") root.querySelector(".fp-signature-status")!.textContent = advanced ? "Signed electronically" : "Signature requested"
  return true
}
