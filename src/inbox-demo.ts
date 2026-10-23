import "./inbox-demo.css"
import { createElement as createLucideElement, Phone, Check, Plane, ArrowRight, FileText, Search, Clock, Pencil, Pause, Play, ChevronRight, Paperclip } from "lucide"
import type { IconNode } from "lucide"

type InboxScene = "email" | "call"
type Phase = { duration: number; title: string; render: () => string }

const icon = (name: string, size = 18) => {
  const icons: Record<string, IconNode> = {
    phone: Phone,
    check: Check,
    plane: Plane,
    arrow: ArrowRight,
    file: FileText,
    search: Search,
    clock: Clock,
    edit: Pencil,
    pause: Pause,
    play: Play,
    chevron: ChevronRight,
    attachment: Paperclip,
  }
  return createLucideElement(icons[name] ?? FileText, { width: size, height: size, "stroke-width": 1.6, "aria-hidden": "true" }).outerHTML
}

const avelAvatar = '<span class="id-avel-avatar"><img src="/assets/avel-mark.png" alt="" /></span>'
const gmailLogo = '<img class="id-gmail-logo" src="/assets/gmail-logo.png" alt="Gmail" width="16" height="16" />'
const clientAvatar = '<span class="id-client-avatar"><img src="/assets/personality-avatars/21-graceful.png" alt="" /></span>'
const pill = (text: string, className = "") => `<span class="id-pill ${className}">${text}</span>`
const status = (text: string, complete = false) => `<div class="id-status"><span class="${complete ? "id-status-check" : "id-working-spinner"}">${complete ? icon("check", 11) : ""}</span>${text}</div>`

function words(text: string, start = 0, interval = 65): string {
  return `<span class="id-sr-only">${text}</span><span aria-hidden="true">${text.split(" ").map((word, index) => `<span class="id-word" style="--word-delay:${start + index * interval}ms">${word} </span>`).join("")}</span>`
}

function sender(name: string, detail: string, agent = false): string {
  return `<div class="id-sender">${agent ? avelAvatar : clientAvatar}<div><strong>${name}</strong><span>${detail}</span></div></div>`
}

function emailShell(content: string, subtitle = "New charter inquiry", badge = "Email"): string {
  return `<div class="id-email-view id-enter"><div class="id-message-title"><div><span class="id-kicker">INBOX / CHARTER REQUESTS</span><h3>${subtitle}</h3></div>${pill(`${gmailLogo}${badge}`, "id-email-badge")}</div>${content}</div>`
}

function originalEmail(highlighting = true): string {
  const mark = (text: string, order: number) => `<mark class="${highlighting ? "id-highlight" : "id-highlight-done"}" style="--highlight-delay:${700 + order * 430}ms">${text}</mark>`
  return `${sender("Marina Alvarez", "marina@northstar.partners · 10:42 AM")}<div class="id-email-body"><p>Hi Avel,</p><p>Could you source a ${mark("midsize jet", 0)} from ${mark("Teterboro to Palm Beach", 1)} on ${mark("Thursday, Nov 12 at 15:00", 2)} for ${mark("4 passengers", 3)}?</p><p>We have two golf bags. Return Sunday at 19:00. Please keep the round trip ${mark("under $32,000 all-in", 4)} and send a couple of options.</p><p>Thank you,<br/>Marina</p></div>`
}

const task = (label: string, detail: string, delay: number) => `<div class="id-task" style="--task-delay:${delay}ms"><span class="id-task-state"><i class="id-working-spinner"></i><b>${icon("check", 11)}</b></span><span>${label}</span><small>${detail}</small></div>`

function workingEmail(): string {
  return emailShell(`<div class="id-compact-email">${sender("Marina Alvarez", "TEB → PBI · Round trip")}${pill("Qualified lead", "id-pill-dark")}<p>4 passengers · Nov 12–15 · $32,000 ceiling</p></div><div class="id-working-card"><div class="id-working-title">${avelAvatar}<strong>Avel working<span class="id-dots">...</span></strong></div><div class="id-task-list">${task("Extract trip requirements", "Trip brief ready", 450)}${task("Match aircraft and baggage capacity", "Midsize cabin", 1400)}${task("Draft operator RFQ", "3 operators selected", 2300)}</div></div><div class="id-bottom-note">${icon("attachment", 13)} Email and trip requirements stay together.</div>`, "A new lead. Already in motion.", "Processing")
}

function rfqCard(revised = false, call = false): string {
  const route = call ? "Teterboro → Miami / Fort Lauderdale" : "Teterboro → Palm Beach"
  const date = call ? "Tomorrow · 08:30" : revised ? "Fri, Nov 13 · 17:30" : "Thu, Nov 12 · 15:00"
  const pax = call ? "6 passengers · 4 bags · 1 pet" : revised ? "6 passengers · 2 golf bags" : "4 passengers · 2 golf bags"
  return `<div class="id-rfq-card"><div class="id-rfq-header"><span class="id-file-icon">${icon("file", 20)}</span><div><strong>${revised ? "Revised " : ""}${call ? "urgent " : ""}charter RFQ</strong><span>${call ? "NORTHSTAR / URGENT REQUEST" : "NORTHSTAR / ROUND TRIP"}</span></div>${pill(revised ? "Updated" : "Draft ready", revised ? "id-pill-dark" : "")}</div><div class="id-rfq-route">${icon("plane", 18)}<strong>${route}</strong></div><dl class="id-rfq-details"><div class="${revised ? "id-field-revised" : ""}"><dt>Departure</dt><dd>${date}</dd></div><div class="${revised && !call ? "id-field-revised" : ""}"><dt>Passengers</dt><dd>${pax}</dd></div><div><dt>${call ? "Aircraft" : "Return"}</dt><dd>${call ? "Super midsize · pet approved" : revised ? "Mon, Nov 16 · 19:00" : "Sun, Nov 15 · 19:00"}</dd></div><div><dt>Budget</dt><dd>${call ? "$38,000" : "$32,000"} all-in ceiling</dd></div></dl><div class="id-rfq-footer">${icon("check", 13)} ${call ? "Repositioning included in pricing request" : "Firm availability & pricing requested"}</div></div>`
}

function emailNegotiation(): string {
  return emailShell(`<div class="id-thread"><article class="id-thread-message">${sender("Marina Alvarez", "Just now")}<p>${words("$34,600 is above our ceiling. Could we leave Friday at 17:30, add two passengers, and return Monday evening? Can the local aircraft keep us under $32,000?")}</p></article><article class="id-thread-message id-thread-agent" style="--thread-delay:2500ms">${sender("Avel Agent", "Reply drafted", true)}<p>${words("I’ve revised the request for six passengers and the new dates. I’m asking for a Teterboro-based aircraft to reduce repositioning, with a firm $32,000 all-in limit. I’ll confirm pricing before you commit.", 2800, 57)}</p></article></div>${status("Revising dates, capacity, and operator pricing request")}`, "A better fit for the budget.", "Negotiating")
}

function revisedEmail(): string {
  return emailShell(`<div class="id-revision-note">${avelAvatar}<div><strong>New dates. Same budget.</strong><p>Departure, passengers, and quote requirements updated.</p></div></div>${rfqCard(true)}<div class="id-draft-reply"><span class="id-kicker">REVISED QUOTE REQUEST</span><p>${words("Requesting a local aircraft to reduce repositioning costs. Firm availability and a quote at or below $32,000 are pending operator confirmation.", 400, 55)}</p></div>`, "The negotiation stays in context.", "Revised")
}

function preliminaryQuote(): string {
  return emailShell(`<div class="id-quote-estimate"><div class="id-estimate-head"><span class="id-file-icon">${icon("file", 20)}</span><div><span class="id-kicker">PRELIMINARY OPERATOR ESTIMATE</span><strong>TEB → PBI · Nov 12–15</strong></div>${pill("Over budget")}</div><div class="id-estimate-price"><div><span>Estimated round trip</span><strong>$34,600</strong></div><small>$2,600 above the $32,000 ceiling</small></div><div class="id-estimate-detail"><span>Aircraft + crew</span><strong>$29,400</strong></div><div class="id-estimate-detail"><span>Repositioning + fees</span><strong>$5,200</strong></div><div class="id-estimate-pending">Firm availability and final pricing pending.</div></div><article class="id-quote-agent">${sender("Avel Agent", "Finding a better option", true)}<p>${words("This estimate is above your ceiling. If Friday works, I can request a Teterboro-based aircraft to reduce repositioning. Shall I check that option?", 300, 58)}</p></article>`, "A quote. And a better question.", "Reviewing")
}

const emailPhases: Phase[] = [
  {
    duration: 2200,
    title: "A new charter request arrives",
    render: () => `<div class="id-inbox-list id-enter"><div class="id-list-heading"><h3>All messages</h3><span>3 unread</span></div><div class="id-list-row id-list-open">${clientAvatar}<div><strong>Marina Alvarez <i></i></strong><b>Charter request · TEB to PBI</b><p>Could you source a midsize jet for Thursday?</p></div><time>Now</time></div><div class="id-list-row">${avelAvatar}<div><strong>Operations desk</strong><b>Updated crew brief · N704AJ</b><p>All documents are attached to the trip.</p></div><time>10:38</time></div><div class="id-list-row"><span class="id-client-avatar"><img src="/assets/personality-avatars/30-confident.png" alt="" /></span><div><strong>Daniel Chen</strong><b>Re: Aircraft availability</b><p>Confirmed. We can hold the aircraft until 12:00.</p></div><time>10:26</time></div><div class="id-list-search">${icon("search", 15)} Every message. The full picture.</div></div>`,
  },
  { duration: 4800, title: "Avel identifies the trip requirements", render: () => emailShell(`${originalEmail()}${status("Identifying route, dates, passengers, and budget")}`) },
  { duration: 4000, title: "Avel qualifies the lead and prepares an RFQ", render: workingEmail },
  { duration: 3800, title: "The operator RFQ is drafted", render: () => emailShell(`${rfqCard()}<div class="id-draft-reply"><span class="id-kicker">REPLY TO MARINA</span><p>${words("I’m sourcing midsize aircraft with space for the golf bags and confirming round-trip pricing within your budget.", 300, 60)}</p></div>`, "From inquiry to a ready RFQ.", "Drafting") },
  { duration: 4600, title: "Avel flags an estimate over budget and proposes reducing repositioning", render: preliminaryQuote },
  { duration: 7800, title: "The client negotiates the budget and changes the schedule", render: emailNegotiation },
  { duration: 5200, title: "The revised RFQ reflects the new trip and the client’s budget", render: revisedEmail },
]

type CallLine = { name: string; text: string; start: number; agent?: boolean }
const callLines: CallLine[] = [
  { name: "Client", start: 0, text: "Our aircraft just went tech. Can you get six of us from Teterboro to Miami at seven tomorrow?" },
  { name: "Avel Agent", start: 3600, agent: true, text: "I can help. Is seven your departure time? And how many bags are you bringing?" },
  { name: "Client", start: 7000, text: "Seven departure. Four checked bags and a small dog. Fort Lauderdale works too if it gives us better options." },
  { name: "Avel Agent", start: 10900, agent: true, text: "Understood. I’m drafting an RFQ for a pet-approved super midsize jet, six passengers, TEB to MIA or FLL." },
  { name: "Client", start: 15200, text: "Actually, make departure eight thirty. Can we stay under thirty-eight thousand, including the reposition?" },
  { name: "Avel Agent", start: 18700, agent: true, text: "Updated to 08:30 with a $38,000 all-in ceiling. I’ll request firm pricing and flag any option over budget before you approve." },
]

function waveform(): string {
  return `<span class="id-waveform" aria-hidden="true">${Array.from({ length: 23 }, (_, index) => `<i style="--bar:${index};--bar-height:${11 + ((index * 17 + 7) % 28)}px"></i>`).join("")}</span>`
}

function callShell(content: string, subtitle = "Live transcript"): string {
  return `<div class="id-call-view id-enter"><div class="id-call-heading"><span class="id-phone-orb">${icon("phone", 21)}</span><div><h3>After-hours charter desk</h3><span>02:14 AM <i>·</i> ${subtitle}</span></div>${pill("Connected", "id-pill-connected")}</div>${content}</div>`
}

function callLine(line: CallLine, index: number, animated = true): string {
  return `<article class="id-call-line ${line.agent ? "id-call-agent" : ""}" data-line="${index}"><span class="id-transcript-speaker">${line.agent ? avelAvatar : clientAvatar}<strong>${line.name}</strong>${line.agent ? '<small>Avel is speaking</small>' : ""}</span><p>${animated ? words(line.text, 0, 60) : line.text}</p></article>`
}

function callConversation(): string {
  return callShell(`<div class="id-call-activity">${waveform()}<span>Listening. Understanding. Moving it forward.</span></div><div class="id-transcript" aria-label="Conversation between Avel Agent and a charter client">${callLine(callLines[0], 0)}</div><div class="id-call-draft"><span class="id-file-icon">${icon("file", 17)}</span><div><strong>Charter RFQ</strong><span data-call-draft>Capturing route and trip requirements</span></div><span class="id-working-spinner"></span></div>`)
}

const callPhases: Phase[] = [
  { duration: 2300, title: "An after-hours client call arrives", render: () => `<div class="id-call-ringing id-enter"><div class="id-call-halo"><span>${icon("phone", 31)}</span></div><span class="id-kicker">02:14 AM · INCOMING CALL</span><h3>Your charter desk is still open.</h3><p>Avel is answering a new client request.</p><div class="id-answer-label">${avelAvatar} Avel Agent <span class="id-dot-pulse"></span> Connecting</div></div>` },
  { duration: 23800, title: "Avel and the client discuss an urgent charter request", render: callConversation },
  { duration: 5400, title: "Avel has revised the urgent charter RFQ", render: () => callShell(`<div class="id-call-summary">${icon("check", 13)} Trip brief updated during the call.</div>${rfqCard(true, true)}<div class="id-call-final">${avelAvatar}<p>${words("I have everything I need. Your updated RFQ is ready for operator availability and firm pricing.", 300, 60)}</p></div>`, "RFQ prepared from the conversation") },
]

export function mountInboxDemo(root: HTMLElement | null = document.getElementById("inbox-demo-root")): (() => void) | undefined {
  if (!root || root.dataset.inboxMounted) return
  root.dataset.inboxMounted = "true"
  root.classList.add("inbox-demo")
  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)")
  let reducedMotion = motionPreference.matches
  let scene: InboxScene = "email"
  let elapsed = 0
  let phaseIndex = -1
  let phaseElapsed = 0
  let userPaused = false
  let inView = false
  let lastTime = 0
  let frame = 0
  let displayedCallLines = 1

  root.innerHTML = `<div class="id-topbar"><div class="id-product-name">${avelAvatar}<strong>Shared inbox</strong></div><div class="id-scene-tabs" role="tablist" aria-label="Choose a conversation demo"><button type="button" role="tab" id="id-email-tab" aria-controls="id-demo-stage" aria-selected="true" data-inbox-scene="email">${gmailLogo}<span>Email</span></button><button type="button" role="tab" id="id-call-tab" aria-controls="id-demo-stage" aria-selected="false" tabindex="-1" data-inbox-scene="call">${icon("phone", 14)}<span>After-hours call</span></button></div><button type="button" class="id-pause-button" aria-label="Pause conversation animation">${icon("pause", 13)}</button></div><div class="id-stage" id="id-demo-stage" role="tabpanel" aria-labelledby="id-email-tab"></div><div class="id-footer"><span class="id-footer-status"><span class="id-dot-pulse"></span><span data-demo-description>New charter request</span></span></div>`
  const stage = root.querySelector<HTMLElement>(".id-stage")!
  const pauseButton = root.querySelector<HTMLButtonElement>(".id-pause-button")!
  const description = root.querySelector<HTMLElement>("[data-demo-description]")!
  const tabs = [...root.querySelectorAll<HTMLButtonElement>("[data-inbox-scene]")]

  const phases = () => scene === "email" ? emailPhases : callPhases
  const updatePause = () => {
    const paused = userPaused || !inView || document.hidden || reducedMotion
    root.classList.toggle("is-paused", paused)
    root.classList.toggle("id-reduced-motion", reducedMotion)
    pauseButton.innerHTML = icon(userPaused ? "play" : "pause", 13)
    pauseButton.setAttribute("aria-label", userPaused ? "Play conversation animation" : "Pause conversation animation")
    pauseButton.hidden = reducedMotion
    lastTime = 0
  }

  const draw = () => {
    const activePhases = phases()
    let offset = 0
    let nextIndex = activePhases.length - 1
    for (let i = 0; i < activePhases.length; i++) {
      if (elapsed < offset + activePhases[i].duration) { nextIndex = i; break }
      offset += activePhases[i].duration
    }
    phaseElapsed = elapsed - offset
    if (phaseIndex !== nextIndex) {
      phaseIndex = nextIndex
      displayedCallLines = 1
      stage.innerHTML = activePhases[phaseIndex].render()
      description.textContent = activePhases[phaseIndex].title
      root.dataset.scene = scene
      root.dataset.phase = String(phaseIndex)
    }
    if (scene === "call" && phaseIndex === 1) {
      const transcript = stage.querySelector<HTMLElement>(".id-transcript")
      const count = callLines.filter(line => phaseElapsed >= line.start).length
      if (transcript && count > displayedCallLines) {
        for (let i = displayedCallLines; i < count; i++) transcript.insertAdjacentHTML("beforeend", callLine(callLines[i], i))
        displayedCallLines = count
        transcript.scrollTo({ top: transcript.scrollHeight, behavior: reducedMotion ? "instant" : "smooth" })
        const draft = stage.querySelector<HTMLElement>("[data-call-draft]")
        if (draft) draft.textContent = count >= 5 ? "Revised · 08:30 departure · $38,000 ceiling" : count >= 4 ? "TEB → MIA / FLL · 6 passengers · pet approved" : "Capturing route and trip requirements"
      }
      const agentSpeaking = Boolean(callLines[Math.max(0, count - 1)]?.agent)
      root.classList.toggle("id-agent-speaking", agentSpeaking)
    }
  }

  const chooseScene = (nextScene: InboxScene, focus = false) => {
    scene = nextScene
    phaseIndex = -1
    const activePhases = phases()
    elapsed = reducedMotion ? activePhases.slice(0, -1).reduce((sum, phase) => sum + phase.duration, 0) + 1 : 0
    root.classList.remove("id-agent-speaking")
    tabs.forEach(tab => {
      const selected = tab.dataset.inboxScene === scene
      tab.setAttribute("aria-selected", String(selected))
      tab.tabIndex = selected ? 0 : -1
      if (selected) {
        stage.setAttribute("aria-labelledby", tab.id)
        if (focus) tab.focus()
      }
    })
    draw()
    updatePause()
  }

  const onTabClick = (event: Event) => {
    const tab = (event.target as Element).closest<HTMLButtonElement>("[data-inbox-scene]")
    if (tab) chooseScene(tab.dataset.inboxScene as InboxScene)
  }
  const onTabKey = (event: KeyboardEvent) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return
    event.preventDefault()
    chooseScene(event.key === "Home" ? "email" : event.key === "End" ? "call" : scene === "email" ? "call" : "email", true)
  }
  const onPause = () => { userPaused = !userPaused; updatePause() }
  const onVisibility = () => updatePause()
  const onMotion = () => { reducedMotion = motionPreference.matches; chooseScene(scene) }
  const tabList = root.querySelector<HTMLElement>(".id-scene-tabs")!
  tabList.addEventListener("click", onTabClick)
  tabList.addEventListener("keydown", onTabKey)
  pauseButton.addEventListener("click", onPause)
  document.addEventListener("visibilitychange", onVisibility)
  motionPreference.addEventListener("change", onMotion)
  const observer = new IntersectionObserver(entries => {
    inView = entries[0].isIntersecting
    updatePause()
  }, { threshold: 0.12 })
  observer.observe(root)

  const tick = (now: number) => {
    if (!userPaused && inView && !document.hidden && !reducedMotion) {
      if (lastTime) elapsed += Math.min(now - lastTime, 100)
      lastTime = now
      const total = phases().reduce((sum, phase) => sum + phase.duration, 0)
      if (elapsed >= total) chooseScene(scene === "email" ? "call" : "email")
      else draw()
    } else lastTime = 0
    frame = requestAnimationFrame(tick)
  }
  chooseScene("email")
  frame = requestAnimationFrame(tick)
  return () => {
    cancelAnimationFrame(frame)
    observer.disconnect()
    tabList.removeEventListener("click", onTabClick)
    tabList.removeEventListener("keydown", onTabKey)
    pauseButton.removeEventListener("click", onPause)
    document.removeEventListener("visibilitychange", onVisibility)
    motionPreference.removeEventListener("change", onMotion)
    delete root.dataset.inboxMounted
  }
}

mountInboxDemo()
