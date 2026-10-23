import "./workflow-showcase.css"
import { scrollToPosition } from "./smooth-scroll"
import { createElement as createLucideElement, DollarSign, Users, Plane, FileText, Check, Pause, Play } from "lucide"

type Brand = { src: string; name: string; className?: string }
type Task = { label: string; working: string; brand?: Brand; icon?: "money" | "people" | "plane" | "file" }
type Workflow = { source: string; message: string; sourceBrand: Brand; tasks: Task[]; result: string; human?: boolean }

const brand = {
  whatsapp: { src: "/assets/workflow-whatsapp.svg", name: "WhatsApp", className: "flow-brand-icon" },
  avinode: { src: "/assets/avinode-logotype.png", name: "Avinode" },
  fl3xx: { src: "/assets/fl3xx-logotype.png", name: "FL3XX" },
  camp: { src: "/assets/camp50-bluelogo.png", name: "CAMP" },
  veryon: { src: "/assets/veryon-primary-black.png", name: "Veryon" },
  veryonMark: { src: "/assets/workflow-veryon-mark.png", name: "Veryon", className: "flow-brand-icon" },
  avel: { src: "/assets/avel-mark.png", name: "Avel", className: "flow-brand-icon" },
}

const workflows: Workflow[] = [
  {
    source: "Marina · Charter inquiry",
    message: "Six guests, Teterboro to Naples on Thursday. Can you find a G650 or similar, with a 9am departure?",
    sourceBrand: brand.whatsapp,
    tasks: [
      { label: "Read email, WhatsApp, and phone requests", working: "Reading request…", brand: brand.whatsapp },
      { label: "Identify the lead and match aircraft", working: "Matching aircraft…", brand: brand.avinode },
      { label: "Draft RFQ and client proposal", working: "Preparing quote…", icon: "money" },
    ],
    result: "RFQ drafted. Your broker has the next step.",
  },
  {
    source: "Pilot report · N724AV",
    message: "A cabin trim vibration was noted after arrival. Please coordinate inspection and keep the records with the aircraft.",
    sourceBrand: brand.veryonMark,
    tasks: [
      { label: "Match the discrepancy to aircraft history", working: "Checking records…", brand: brand.camp },
      { label: "Coordinate the maintenance request", working: "Routing service…", brand: brand.veryon },
      { label: "File work order, sign-off, and invoice", working: "Updating record…", icon: "file" },
    ],
    result: "One aircraft record. Less chasing the paper trail.",
  },
  {
    source: "Dispatch · TEB to PBI",
    message: "Departure moved to 15:30Z. Update the pilots and confirm fuel, catering, and handling with the FBO.",
    sourceBrand: brand.whatsapp,
    tasks: [
      { label: "Update pilot and team communication", working: "Notifying crew…", icon: "people" },
      { label: "Coordinate FBO and airport services", working: "Confirming services…", icon: "plane" },
      { label: "Refresh the shared departure brief", working: "Syncing the team…", icon: "file" },
    ],
    result: "Pilots, dispatch, and ground teams are in sync.",
  },
  {
    source: "Client update · Operator review",
    message: "The client wants a later departure and a larger aircraft. Prepare the changes for my approval before sending.",
    sourceBrand: brand.avel,
    tasks: [
      { label: "Recheck aircraft and schedule fit", working: "Reviewing options…", brand: brand.avinode },
      { label: "Prepare the revised quote and plan", working: "Drafting changes…", icon: "money" },
      { label: "Bring the decision to your team", working: "Preparing review…", icon: "people" },
    ],
    result: "Approved by your team. Avel carries it forward.",
    human: true,
  },
]

const spinner = `<svg class="flow-spinner" viewBox="0 0 24 24" aria-hidden="true">${Array.from({ length: 12 }, (_, n) => `<line x1="12" y1="2" x2="12" y2="6" transform="rotate(${n * 30} 12 12)" opacity="${(n + 1) / 12}" />`).join("")}</svg>`
const check = createLucideElement(Check, { "aria-hidden": "true", "stroke-width": 1.8 }).outerHTML
const brandImage = (mark: Brand) => `<img class="flow-brand ${mark.className || ""}" src="${mark.src}" alt="${mark.name}" />`
const taskIcon = (name: Task["icon"] = "file") => {
  const icons = { money: DollarSign, people: Users, plane: Plane, file: FileText }
  const element = createLucideElement(icons[name], { "aria-hidden": "true", "stroke-width": 1.5 })
  element.classList.add("flow-task-icon")
  return element.outerHTML
}

const section = document.getElementById("workflows")
const sequence = document.getElementById("flow-sequence")
const panel = document.getElementById("flow-panel")
const tabs = Array.from(document.querySelectorAll<HTMLButtonElement>("[data-flow-tab]"))

if (section && sequence && panel && tabs.length) {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
  const smallScreen = window.matchMedia("(max-width: 820px)")
  const shortViewport = window.matchMedia("(max-height: 600px)")
  let selected = 0
  let phase = 0
  let timer: ReturnType<typeof setTimeout> | undefined
  let inView = false
  let paused = false
  let scrollIntentUntil = 0

  const clearTimer = () => { if (timer) window.clearTimeout(timer); timer = undefined }
  const setPhase = () => {
    const flow = workflows[selected]
    const complete = phase >= (flow.human ? 4 : 3)
    const needsReview = Boolean(flow.human && phase === 3)
    sequence.querySelectorAll<HTMLElement>(".flow-task").forEach((row, index) => {
      const done = complete || (index < Math.min(phase, 3) && !(needsReview && index === 2))
      const active = !complete && index === Math.min(phase, 2)
      row.classList.toggle("is-done", done)
      row.classList.toggle("is-working", active)
      row.classList.toggle("is-review", needsReview && active)
      row.querySelector(".flow-task-status")!.textContent = done ? "Done" : active ? needsReview ? "Your review" : flow.tasks[index].working : index === phase + 1 ? "Up next" : "Pending"
    })
    sequence.querySelector(".flow-working-heading")!.textContent = complete ? "All set." : needsReview ? "Avel needs your review" : "Avel working…"
    sequence.querySelector(".flow-outcome")!.classList.toggle("is-visible", complete)
    sequence.querySelector(".flow-outcome")!.setAttribute("aria-hidden", String(!complete))
    const review = sequence.querySelector<HTMLElement>(".flow-review")
    if (review) {
      review.classList.toggle("is-visible", phase >= 3)
      review.classList.toggle("is-approved", complete)
      review.querySelector(".flow-review-action")!.textContent = complete ? "Approved" : "Approve plan"
    }
  }

  const schedule = () => {
    clearTimer()
    if (reducedMotion.matches || paused || !inView || document.hidden) return
    const flow = workflows[selected]
    const lastPhase = flow.human ? 4 : 3
    const delay = phase === lastPhase ? 2600 : flow.human && phase === 3 ? 3000 : 2500
    timer = window.setTimeout(() => {
      if (phase >= lastPhase) { phase = 0; setPhase(); schedule() }
      else { phase += 1; setPhase(); schedule() }
    }, delay)
  }

  const select = (index: number, focus = false) => {
    selected = index
    const flow = workflows[index]
    phase = reducedMotion.matches ? flow.human ? 4 : 3 : 0
    tabs.forEach((tab, tabIndex) => {
      tab.classList.toggle("is-active", tabIndex === index)
      tab.setAttribute("aria-selected", String(tabIndex === index))
      tab.tabIndex = tabIndex === index ? 0 : -1
    })
    panel.setAttribute("aria-labelledby", tabs[index].id)
    sequence.innerHTML = `<article class="flow-message flow-card"><div class="flow-message-top"><span class="flow-client"><img src="/assets/personality-avatars/${index === 1 ? "05-serious" : index === 2 ? "18-focused" : "03-curious"}.png" alt="" /><span>${flow.source}</span></span>${brandImage(flow.sourceBrand)}</div><p>${flow.message}</p></article><article class="flow-workcard flow-card"><div class="flow-working-top"><img src="/assets/avel-mark.png" alt="" /><strong class="flow-working-heading">Avel working…</strong></div><div class="flow-tasks">${flow.tasks.map((task) => `<div class="flow-task"><span class="flow-task-marker">${spinner}<span class="flow-pending-ring"></span><span class="flow-check">${check}</span></span><div class="flow-task-body">${task.brand ? brandImage(task.brand) : taskIcon(task.icon)}<span>${task.label}</span><span class="flow-task-status"></span></div></div>`).join("")}</div>${flow.human ? '<div class="flow-review"><span><img src="/assets/personality-avatars/18-focused.png" alt="" /> Jordan · Operations</span><span class="flow-review-action">Approve plan</span></div>' : ""}</article><div class="flow-outcome flow-card"><span class="flow-outcome-check">${check}</span><span>${flow.result}</span></div>`
    sequence.classList.remove("flow-enter")
    void sequence.offsetWidth
    sequence.classList.add("flow-enter")
    setPhase()
    if (focus) tabs[index].focus()
    schedule()
  }

  const scrollToWorkflow = (index: number, focus = false) => {
    select(index, focus)
    if (shortViewport.matches) return
    scrollIntentUntil = performance.now() + 1800
    const start = section.getBoundingClientRect().top + window.scrollY
    const distance = Math.max(1, section.offsetHeight - window.innerHeight)
    scrollToPosition(start + distance * (index + 0.15) / workflows.length)
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => scrollToWorkflow(index))
    tab.addEventListener("keydown", (event) => {
      let next = index
      if (["ArrowDown", "ArrowRight"].includes(event.key)) next = (index + 1) % tabs.length
      else if (["ArrowUp", "ArrowLeft"].includes(event.key)) next = (index + tabs.length - 1) % tabs.length
      else if (event.key === "Home") next = 0
      else if (event.key === "End") next = tabs.length - 1
      else return
      event.preventDefault(); scrollToWorkflow(next, true)
    })
  })
  const pause = document.createElement("button")
  pause.className = "flow-pause"
  pause.type = "button"
  pause.setAttribute("aria-label", "Pause workflow animation")
  pause.innerHTML = createLucideElement(Pause, { "aria-hidden": "true" }).outerHTML
  pause.addEventListener("click", () => {
    paused = !paused
    pause.setAttribute("aria-label", paused ? "Play workflow animation" : "Pause workflow animation")
    pause.innerHTML = createLucideElement(paused ? Play : Pause, { "aria-hidden": "true" }).outerHTML
    panel.classList.toggle("is-paused", paused)
    schedule()
  })
  panel.append(pause)
  let scrollFrame = 0
  const updateFromScroll = () => {
    scrollFrame = 0
    if (shortViewport.matches) return
    if (performance.now() < scrollIntentUntil) return
    const start = section.getBoundingClientRect().top + window.scrollY
    const distance = Math.max(1, section.offsetHeight - window.innerHeight)
    const progress = Math.max(0, Math.min(1, (window.scrollY - start) / distance))
    const index = Math.min(workflows.length - 1, Math.floor(progress * workflows.length))
    if (index !== selected) select(index)
  }
  const requestScrollUpdate = () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateFromScroll) }
  window.addEventListener("scroll", requestScrollUpdate, { passive: true })
  window.addEventListener("resize", requestScrollUpdate, { passive: true })
  window.addEventListener("wheel", () => { scrollIntentUntil = 0 }, { passive: true })
  window.addEventListener("touchstart", () => { scrollIntentUntil = 0 }, { passive: true })
  const orientation = () => document.querySelector(".flow-tabs")?.setAttribute("aria-orientation", smallScreen.matches ? "horizontal" : "vertical")
  orientation(); smallScreen.addEventListener("change", orientation)
  reducedMotion.addEventListener("change", () => select(selected))
  document.addEventListener("visibilitychange", schedule)
  new IntersectionObserver((entries) => { inView = entries[0].isIntersecting; schedule() }, { threshold: 0.15 }).observe(section)
  select(0)
  requestScrollUpdate()
}
