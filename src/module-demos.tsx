import { useRef } from "react"
import { createRoot } from "react-dom/client"
import { useModuleSequence, ModuleControls, ModuleFigure, ModuleIcon } from "./module-motion"
import "./module-demos.css"

const charterStages = [
  ["A new trip takes shape.", "Reading the route, timing, and passenger requirements."],
  ["The details, connected.", "Matching the request to the right cabin and schedule."],
  ["A shortlist worth reviewing.", "Comparing aircraft fit, positioning, and indicative pricing."],
  ["From request to proposal.", "Building an itemized quote with the selected aircraft."],
  ["A change? Already reflected.", "Revising departure and checking the impact on the proposal."],
  ["One proposal. Ready for your call.", "The revised quote and trip context are together for review."],
]
const aircraftOptions = [
  { name: "Citation Latitude", cabin: "Midsize · 9 seats", price: "$18,450" },
  { name: "Challenger 350", cabin: "Super midsize · 8 seats", price: "$21,200" },
  { name: "Gulfstream G550", cabin: "Heavy · 14 seats", price: "$26,800" },
]

export function CharterDemo() {
  const host = useRef<HTMLElement>(null)
  const motion = useModuleSequence(host, 6)
  const { step } = motion
  const revised = step >= 4
  const quote = step >= 3
  return <section ref={host} className="charter-demo" data-step={step} data-playing={motion.playing} aria-label="Animated charter request and proposal">
    <header className="md-panel-header"><div><img src="/assets/avel-mark.png" alt="" /><strong>Charter desk</strong><span>FLL to TEB</span></div><ModuleControls paused={motion.paused} onPause={motion.togglePause} onReplay={motion.replay} label="charter request" reduced={motion.reduced} /></header>
    <div className="charter-demo-body">
      <div className="charter-demo-intelligence">
        <ModuleFigure kind="riffle" beat={step} playing={motion.playing} theme="dark" />
        <div key={step} className="module-demo-enter"><span className="module-demo-label">{step === 5 ? "Prepared for review" : "Avel at work"}</span><h3>{charterStages[step][0]}</h3><p>{charterStages[step][1]}</p></div>
        <div className="charter-demo-context"><span><ModuleIcon name="users" />3 passengers</span><span><ModuleIcon name="calendar" />Friday</span></div>
      </div>
      <div className="charter-demo-workspace">
        {step < 2 ? <article className="charter-demo-email module-demo-enter" key="email">
          <div className="charter-demo-document-head"><img src="/assets/gmail-logo.png" alt="Gmail" /><span>New charter inquiry</span><small>10:42</small></div>
          <div className="charter-demo-sender"><span>MA</span><div><strong>Marina Alvarez</strong><small>To Avel charter desk</small></div></div>
          <h4>Friday flight to Teterboro</h4><p>Hi Avel, can you arrange <mark data-active={step > 0}>Fort Lauderdale to Teterboro</mark> this Friday? We’ll be <mark data-active={step > 0}>3 passengers</mark>, departing at <mark data-active={step > 0}>09:00</mark>.</p><p>A comfortable midsize cabin would be ideal. Please send the best options.</p>
          <div className="charter-demo-extraction" data-active={step > 0}><span><ModuleIcon name="plane" />FLL to TEB</span><span><ModuleIcon name="clock" />09:00 EDT</span><span><ModuleIcon name="users" />3 guests</span></div>
        </article> : !quote ? <article className="charter-demo-options module-demo-enter" key="options">
          <div className="charter-demo-document-head"><ModuleIcon name="plane" /><span>Aircraft shortlist</span><span className="charter-demo-provider">via<img src="/assets/avinode-logotype.png" alt="Avinode" /></span></div>
          <p className="charter-demo-options-intro">FLL to TEB · Friday · 3 passengers</p>
          {aircraftOptions.map((aircraft, i) => <div key={aircraft.name} className={`charter-demo-option${i === 0 ? " is-selected" : ""}`} style={{ animationDelay: `${i * 110}ms` }}><ModuleIcon name="plane" /><div><strong>{aircraft.name}</strong><small>{aircraft.cabin}</small></div><div><strong>{aircraft.price}</strong><small>{i === 0 ? "Best fit" : "Compare"}</small></div></div>)}
          <small className="charter-demo-estimate-note">Indicative options · operator confirmation required</small>
        </article> : <article className="charter-demo-proposal module-demo-enter" key="proposal">
          <div className="charter-demo-document-head"><ModuleIcon name="file-text" /><span>Charter proposal.pdf</span><small>{revised ? "v2" : "v1"}</small></div>
          <div className="charter-demo-paper">
            <div className="charter-demo-paper-brand"><img src="/assets/avel-wordmark.png" alt="Avel" /><span>CHARTER PROPOSAL</span></div>
            <h4>FLL <ModuleIcon name="arrow-right" /> TEB</h4><p>Fort Lauderdale to Teterboro</p>
            <div className="charter-demo-proposal-facts"><span><small>Aircraft</small>Citation Latitude</span><span key={revised ? "revised" : "original"} className={revised ? "charter-demo-revised" : ""}><small>Friday departure</small>{revised ? "11:30" : "09:00"} EDT</span></div>
            <dl><div><dt>Aircraft & crew</dt><dd>$16,800</dd></div><div><dt>Handling & airport fees</dt><dd>$1,650</dd></div><div className="charter-demo-total"><dt>Estimated total</dt><dd>$18,450</dd></div></dl>
            <div className="charter-demo-paper-footer"><ModuleIcon name={step === 5 ? "shield-check" : "file-text"} size={14} />{step === 5 ? "Ready for your review" : "Draft · subject to operator confirmation"}</div>
          </div>
        </article>}
        <div className="charter-demo-message" key={`message-${step}`}><ModuleIcon name={revised ? "message-circle" : quote ? "dollar-sign" : "mail"} /><p>{step === 4 ? <><strong>Marina:</strong> Can we make that 11:30 instead?</> : step === 5 ? <><strong>Avel:</strong> Revised to 11:30. Quote and crew requests updated.</> : quote ? "Proposal drafted with itemized pricing and the full trip brief." : step === 2 ? "Comparing positioning, cabin capacity, and estimated total." : "The conversation stays attached to the request."}</p></div>
      </div>
    </div>
    <footer className="charter-demo-footer"><span><ModuleIcon name={step === 5 ? "shield-check" : "link"} />{step === 5 ? "Trip brief and proposal ready for approval" : "Request, aircraft, and proposal in one place"}</span><a href="#modules">View the workflow<ModuleIcon name="arrow-up-right" size={14} /></a></footer>
  </section>
}

const agentData = [
  ["Avel One", "/assets/avel-mark.png", "Global orchestrator"],
  ["Sales & Customer Revenue", "/assets/agent-avatars/01-short-loose-curls.png", "Client & proposal"],
  ["Empty Legs & Network Revenue", "/assets/agent-avatars/05-sleek-side-bob.png", "Positioning & network"],
  ["Trip Operations", "/assets/agent-avatars/14-high-bun.png", "Trip coordination"],
  ["Crew", "/assets/agent-avatars/20-double-braids.png", "Pilot & duty context"],
  ["Maintenance", "/assets/agent-avatars/11-long-straight-center.png", "Aircraft readiness"],
  ["FBO & Ground", "/assets/agent-avatars/04-tight-coily-halo.png", "Ground coordination"],
  ["Fuel", "/assets/agent-avatars/09-shoulder-waves.png", "Uplift & service"],
]
const agentStages = [
  { title: "One change. The right team.", detail: "Marina moves Friday’s departure from 09:00 to 11:30.", active: [0], tasks: ["Reading the revision", "Client context", "Route context", "Trip context", "Duty context", "Aircraft context", "Ground context", "Service context"] },
  { title: "Work goes to the specialists.", detail: "Avel One distributes the new departure and shared trip context.", active: [0, 1, 2, 3], tasks: ["Assigning the work", "Revise the proposal", "Check positioning", "Update departure", "Receive new timing", "Receive trip context", "Receive slot request", "Receive service request"] },
  { title: "Readiness, checked in parallel.", detail: "Crew reviews the duty window while Maintenance checks aircraft context.", active: [4, 5], tasks: ["Coordinating", "Proposal in progress", "Positioning reviewed", "Departure revised", "Duty window reviewed", "Aircraft record reviewed", "Slot request queued", "Service request queued"] },
  { title: "Ground plans catch up.", detail: "FBO and Fuel prepare the revised arrival and service requests.", active: [6, 7], tasks: ["Coordinating", "Proposal in progress", "Positioning reviewed", "Linking ground notes", "11:30 brief prepared", "Aircraft context linked", "11:30 slot requested", "Uplift request prepared"] },
  { title: "Every detail comes together.", detail: "Trip Operations consolidates the brief. Sales updates the client proposal.", active: [0, 1, 3], tasks: ["Consolidating results", "Proposal v2 drafted", "Positioning linked", "Shared brief assembled", "Crew notes attached", "Aircraft record linked", "Ground request attached", "Fuel request attached"] },
  { title: "A coordinated handoff.", detail: "The revised brief is ready for the team to review and approve.", active: [0, 1, 2, 3, 4, 5, 6, 7], tasks: ["Shared context ready", "Proposal v2 ready", "Positioning linked", "Brief ready for review", "Crew notes linked", "Readiness notes linked", "FBO request linked", "Fuel request linked"] },
]
export function AgentsDemo() {
  const host = useRef<HTMLElement>(null)
  const motion = useModuleSequence(host, 6)
  const stage = agentStages[motion.step]
  return <section ref={host} className="agents-demo" data-step={motion.step} data-playing={motion.playing} aria-label="Animated specialist agent coordination">
    <header className="md-panel-header"><div><ModuleIcon name="workflow" /><strong>One team. Shared context.</strong></div><ModuleControls paused={motion.paused} onPause={motion.togglePause} onReplay={motion.replay} label="agent coordination" reduced={motion.reduced} /></header>
    <div className="agents-demo-dispatch"><ModuleFigure kind="rebuild" beat={motion.step} playing={motion.playing} /><div key={motion.step} className="module-demo-enter"><span className="module-demo-label">{motion.step === 5 ? "Prepared for review" : "Avel One coordinating"}</span><h4>{stage.title}</h4><p>{stage.detail}</p><span className="agents-demo-trip"><ModuleIcon name="plane" size={13} />FLL to TEB · 11:30 · 3 guests</span></div></div>
    <div className="agents-demo-grid">{agentData.map(([name, image, role], i) => <article className={`agents-demo-folder${stage.active.includes(i) ? " is-active" : ""}${motion.step === 5 ? " is-ready" : ""}`} key={name} style={{ transitionDelay: `${i * 30}ms` }}>
      <div className="agents-demo-folder-top"><span>{motion.step === 5 ? "Linked" : stage.active.includes(i) ? "Working" : "Connected"}</span></div><div className="agents-demo-folder-content"><div className="agents-demo-person"><img src={image} alt="" /><div><strong>{name}</strong><small>{role}</small></div></div><p key={`${motion.step}-${i}`}><ModuleIcon name={motion.step === 5 ? "link" : ["workflow", "dollar-sign", "plane", "file-text", "users", "wrench", "plane", "fuel"][i]} size={12} />{stage.tasks[i]}</p></div>
    </article>)}</div>
    <footer className="agents-demo-summary"><ModuleIcon name={motion.step === 5 ? "file-text" : "message-circle"} /><div key={motion.step} className="module-demo-enter"><strong>{motion.step === 5 ? "Departure brief v2.pdf" : motion.step >= 3 ? "Updates flow back to the same trip" : "Avel One keeps the handoffs connected"}</strong><span>{motion.step === 5 ? "Proposal, crew, aircraft, and ground requests linked" : "One revision, carried across every assigned task"}</span></div><span className="agents-demo-count">{motion.step === 5 ? "8/8" : `${stage.active.length} active`}</span></footer>
  </section>
}

const networkStages = [
  ["A request arrives.", "The email becomes the start of a connected trip."],
  ["Context travels with it.", "Route, travelers, and timing link to one request."],
  ["The aircraft fit is attached.", "Cabin and schedule context inform the proposal."],
  ["A new departure. One shared update.", "11:30 is reflected in the trip, crew, and FBO requests."],
  ["The brief builds itself.", "Conversation, proposal, and coordination notes are together."],
  ["Ready for the operation.", "Your team can review the whole request in one place."],
]
const requestRows = [["Marina Alvarez", "FLL to TEB", "Citation Latitude"], ["Jordan Wells", "PBI to BNA", "Challenger 350"], ["Charter broker", "TEB to MIA", "Pending fit"], ["Operations desk", "DAL to ASE", "Pending schedule"]]
export function NetworkDemo() {
  const host = useRef<HTMLElement>(null)
  const motion = useModuleSequence(host, 6)
  const step = motion.step
  const state = ["New", "Qualifying", "Matched", "Revising", "Preparing", "Ready"][step]
  return <section ref={host} className="network-demo" data-step={step} data-playing={motion.playing} aria-label="Animated request to trip operations">
    <header className="md-panel-header"><div><ModuleIcon name="mail" /><strong>Requests & trip conversations</strong></div><ModuleControls paused={motion.paused} onPause={motion.togglePause} onReplay={motion.replay} label="request to operation" reduced={motion.reduced} /></header>
    <div className="network-demo-table-wrap"><table><thead><tr><th scope="col">Request</th><th scope="col">Route</th><th scope="col">Aircraft fit</th><th scope="col">Status</th></tr></thead><tbody>{requestRows.map(([name, route, aircraft], i) => <tr key={name} className={i === 0 ? "is-selected" : ""}><td>{i === 0 && <img src="/assets/gmail-logo.png" alt="Gmail" />}{name}</td><td>{route}</td><td>{i === 0 && step < 2 ? "Matching aircraft" : aircraft}</td><td><span className={`network-demo-badge${i === 0 && step === 5 ? " is-ready" : ""}`} key={i === 0 ? step : name}>{i === 0 ? state : ["", "Planning", "New", "Review"][i]}</span></td></tr>)}</tbody></table></div>
    <div className="network-demo-inspector"><div className="network-demo-record"><ModuleFigure kind="exploded" beat={step} playing={motion.playing} /><div key={step} className="module-demo-enter"><span className="module-demo-label">{step === 5 ? "Ready for review" : "Connected trip record"}</span><h4>{networkStages[step][0]}</h4><p>{networkStages[step][1]}</p></div></div>
      <div className="network-demo-details"><div className="network-demo-record-head"><img src="/assets/avel-mark.png" alt="" /><span>TRIP AV-2048</span><span className="network-demo-record-state">{step === 5 ? "Ready" : "In progress"}</span></div>{step === 3 ? <div className="network-demo-sms module-demo-enter"><span className="network-demo-sms-label"><ModuleIcon name="message-circle" size={13} />Trip coordination</span><p>Could we leave at 11:30 instead?</p><p>Avel: The trip is now set to 11:30. Crew and FBO updates are prepared.</p><small>Updated trip AV-2048 · 3 passengers</small></div> : step >= 4 ? <div className="network-demo-brief module-demo-enter"><div><img src="/assets/avel-wordmark.png" alt="Avel" /><span>DEPARTURE BRIEF</span></div><h4>FLL <ModuleIcon name="arrow-right" /> TEB</h4><dl><div><dt>Friday departure</dt><dd>11:30 EDT</dd></div><div><dt>Aircraft</dt><dd>Citation Latitude</dd></div><div><dt>Passengers</dt><dd>3 guests</dd></div><div><dt>Estimated quote</dt><dd>$18,450</dd></div></dl><div className="network-demo-brief-files"><ModuleIcon name="file-text" size={12} />Brief v2.pdf<span>Prepared for review</span></div></div> : <><h4>FLL <ModuleIcon name="arrow-right" /> TEB</h4><dl><div><dt>Departure</dt><dd>09:00 EDT</dd></div><div><dt>Passengers</dt><dd>3 guests</dd></div><div><dt>Aircraft</dt><dd>{step >= 2 ? "Citation Latitude" : "Matching"}</dd></div></dl></>}
      <div className="network-demo-attachments"><span className={step >= 1 ? "is-linked" : ""}><ModuleIcon name="mail" size={12} />Email</span><span className={step >= 2 ? "is-linked" : ""}><ModuleIcon name="file-text" size={12} />Proposal</span><span className={step >= 4 ? "is-linked" : ""}><ModuleIcon name="users" size={12} />Trip brief</span></div><div className="network-demo-event" key={step}><ModuleIcon name={step === 5 ? "shield-check" : step === 3 ? "send" : "link"} size={13} />{["Request received", "Conversation linked", "Aircraft context attached", "Crew & FBO updates prepared", "Brief v2 assembled", "All records ready for review"][step]}</div></div>
    </div>
    <footer className="network-demo-footer"><ModuleIcon name="layers" size={14} />One request. The complete operational picture.</footer>
  </section>
}

for (const [id, Component] of [["charter-demo", CharterDemo], ["agents-demo", AgentsDemo], ["network-demo", NetworkDemo]] as const) {
  const host = document.getElementById(id)
  if (host) createRoot(host).render(<Component />)
}
