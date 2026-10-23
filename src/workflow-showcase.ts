import "./workflow-showcase.css"
import { scrollToPosition } from "./smooth-scroll"
import { createElement as createLucideElement, DollarSign, Users, Plane, FileText, Check, Pause, Play } from "lucide"

import { workflows } from "./workflow-data"
import type { Brand, Task } from "./workflow-data"
import { workflowSteps, taskState, stepDuration, workflowAtProgress } from "./workflow-state"

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
  let pinned = true
  section.style.setProperty("--workflow-scroll-height", `${100 + workflows.length * 65}svh`)
  let selected = 0
  let phase = 0
  let steps = workflowSteps(workflows[0])
  let timer: ReturnType<typeof setTimeout> | undefined
  let inView = false
  let paused = false
  let scrollIntentUntil = 0

  const clearTimer = () => { if (timer) window.clearTimeout(timer); timer = undefined }
  const setPhase = () => {
    const flow = workflows[selected]
    const step = steps[phase]
    const complete = step.kind === "complete"
    const needsReview = step.kind === "review"
    sequence.querySelectorAll<HTMLElement>(".flow-task").forEach((row, index) => {
      const state = taskState(flow, step, index)
      row.classList.toggle("is-done", state.done)
      row.classList.toggle("is-working", state.active || state.review)
      row.classList.toggle("is-review", state.review)
      const status = row.querySelector<HTMLElement>(".flow-task-status")!
      if (status.textContent !== state.status) {
        status.textContent = state.status
        status.classList.remove("flow-status-enter")
        void status.offsetWidth
        status.classList.add("flow-status-enter")
      }
    })
    sequence.querySelector(".flow-working-heading")!.textContent = complete ? "All set." : needsReview ? "Avel needs your review" : step.kind === "approved" ? "Approved. Moving ahead…" : "Avel working…"
    const insight = sequence.querySelector<HTMLElement>(".flow-insight")!
    const currentTask = flow.tasks[step.kind === "complete" ? flow.tasks.length - 1 : step.task]
    const detail = step.kind === "working" && step.beat === 0 ? currentTask.label : currentTask.detail
    if (insight.textContent !== detail) {
      insight.textContent = detail
      insight.classList.remove("flow-status-enter")
      void insight.offsetWidth
      insight.classList.add("flow-status-enter")
    }
    sequence.querySelector(".flow-outcome")!.classList.toggle("is-visible", complete)
    sequence.querySelector(".flow-outcome")!.setAttribute("aria-hidden", String(!complete))
    const review = sequence.querySelector<HTMLElement>(".flow-review")
    if (review && flow.review) {
      const visible = complete || (step.kind !== "working" || step.task > flow.review.afterTask)
      review.classList.toggle("is-visible", visible)
      review.classList.toggle("is-approved", visible && !needsReview)
      review.setAttribute("aria-hidden", String(!visible))
      review.querySelector(".flow-review-action")!.textContent = needsReview ? flow.review.request : flow.review.approved
    }
  }

  const schedule = () => {
    clearTimer()
    if (reducedMotion.matches || paused || !inView || document.hidden) return
    timer = window.setTimeout(() => {
      phase = (phase + 1) % steps.length
      setPhase()
      schedule()
    }, stepDuration(steps[phase]))
  }

  const select = (index: number, focus = false) => {
    selected = index
    const flow = workflows[index]
    steps = workflowSteps(flow)
    phase = reducedMotion.matches ? steps.length - 1 : 0
    tabs.forEach((tab, tabIndex) => {
      tab.classList.toggle("is-active", tabIndex === index)
      tab.setAttribute("aria-selected", String(tabIndex === index))
      tab.tabIndex = tabIndex === index ? 0 : -1
    })
    panel.setAttribute("aria-labelledby", tabs[index].id)
    sequence.innerHTML = `<article class="flow-message flow-card"><div class="flow-message-top"><span class="flow-client"><img src="${flow.avatar || "/assets/personality-avatars/03-curious.png"}" alt="" /><span>${flow.source}</span></span>${brandImage(flow.sourceBrand)}</div><p>${flow.message}</p></article><article class="flow-workcard flow-card"><div class="flow-working-top"><img src="/assets/avel-mark.png" alt="" /><strong class="flow-working-heading">Avel working…</strong></div><p class="flow-insight"></p><div class="flow-tasks">${flow.tasks.map((task) => `<div class="flow-task"><span class="flow-task-marker">${spinner}<span class="flow-pending-ring"></span><span class="flow-check">${check}</span></span><div class="flow-task-body">${task.brand ? brandImage(task.brand) : taskIcon(task.icon)}<span class="flow-task-copy">${task.label}</span><span class="flow-task-status"></span></div></div>`).join("")}</div>${flow.review ? `<div class="flow-review" aria-hidden="true"><span><img src="/assets/personality-avatars/18-focused.png" alt="" /> ${flow.review.person}</span><span class="flow-review-action">${flow.review.request}</span></div>` : ""}</article><div class="flow-outcome flow-card"><span class="flow-outcome-check">${check}</span><span>${flow.result}</span></div>`
    sequence.classList.remove("flow-enter")
    void sequence.offsetWidth
    sequence.classList.add("flow-enter")
    setPhase()
    if (smallScreen.matches) {
      const tabList = tabs[index].parentElement!
      tabList.scrollTo({ left: tabs[index].getBoundingClientRect().left - tabList.getBoundingClientRect().left + tabList.scrollLeft - (tabList.clientWidth - tabs[index].offsetWidth) / 2, behavior: reducedMotion.matches ? "instant" : "smooth" })
    }
    if (focus) tabs[index].focus({ preventScroll: true })
    schedule()
  }

  const scrollToWorkflow = (index: number, focus = false) => {
    select(index, focus)
    if (!pinned) return
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
    if (!pinned) return
    if (performance.now() < scrollIntentUntil) return
    const start = section.getBoundingClientRect().top + window.scrollY
    const distance = Math.max(1, section.offsetHeight - window.innerHeight)
    const progress = Math.max(0, Math.min(1, (window.scrollY - start) / distance))
    const index = workflowAtProgress(progress, workflows.length)
    if (index !== selected) select(index)
  }
  const requestScrollUpdate = () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateFromScroll) }
  window.addEventListener("scroll", requestScrollUpdate, { passive: true })
  const updatePinning = () => {
    pinned = window.innerHeight > (smallScreen.matches ? 900 : 780)
    section.classList.toggle("flow-unpinned", !pinned)
    requestScrollUpdate()
  }
  window.addEventListener("resize", updatePinning, { passive: true })
  window.addEventListener("wheel", () => { scrollIntentUntil = 0 }, { passive: true })
  window.addEventListener("touchstart", () => { scrollIntentUntil = 0 }, { passive: true })
  const orientation = () => document.querySelector(".flow-tabs")?.setAttribute("aria-orientation", smallScreen.matches ? "horizontal" : "vertical")
  orientation(); smallScreen.addEventListener("change", orientation)
  reducedMotion.addEventListener("change", () => select(selected))
  document.addEventListener("visibilitychange", schedule)
  new IntersectionObserver((entries) => { inView = entries[0].isIntersecting; schedule() }, { threshold: 0.15 }).observe(panel)
  select(0)
  updatePinning()
}
