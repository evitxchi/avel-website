import "./overview-demo.css"
import { useLayoutEffect, useRef } from "react"
import { createElement, Pause, Play, RotateCcw, FileText, Plane, Users, ArrowUp, Plus, ChevronDown, Mail } from "lucide"
import type { IconNode } from "lucide"
import { mountWorkflowDiagram, updateWorkflowDiagram, destroyWorkflowDiagram } from "./workflow-diagrams"
import type { WorkflowDiagram } from "./workflow-diagram-data"
import { overviewQuestion, overviewStatuses } from "./overview-state"
import type { OverviewTrip, OverviewFrame } from "./overview-state"

function Icon({ node }: { node: IconNode }) {
  const ref = useRef<HTMLSpanElement>(null)
  useLayoutEffect(() => { ref.current?.replaceChildren(createElement(node, { "aria-hidden": "true", "stroke-width": 1.5 })) }, [node])
  return <span className="overview-icon" ref={ref} aria-hidden="true" />
}

const scenes: Record<OverviewFrame["phase"], { figure: WorkflowDiagram["figure"]; title: string; detail: string }> = {
  request: { figure: "hub", title: "Every trip starts with a request.", detail: "Avel brings the details into one working view." },
  context: { figure: "hub", title: "Putting the trip in context.", detail: "Route, passengers, and timing, connected." },
  aircraft: { figure: "loupe", title: "Finding the aircraft fit.", detail: "The request is matched to aircraft context." },
  coordination: { figure: "relay", title: "Bringing the team together.", detail: "Crew and ground service requests, prepared." },
  ready: { figure: "format", title: "One brief. A clear next step.", detail: "The trip is ready for your team to review." },
}

function OverviewFigure({ frame, running }: { frame: OverviewFrame; running: boolean }) {
  const root = useRef<HTMLDivElement>(null)
  const scene = scenes[frame.phase]
  useLayoutEffect(() => {
    const host = root.current!
    mountWorkflowDiagram(host, { figure: scene.figure, title: scene.title, description: scene.detail, facts: [] })
    return () => destroyWorkflowDiagram(host)
  }, [scene.figure])
  useLayoutEffect(() => { if (root.current) updateWorkflowDiagram(root.current, frame.beat, running) }, [scene.figure, frame.beat, running])
  return <div className="overview-figure" ref={root} aria-hidden="true"><div className="flow-diagram-figure" /></div>
}

export function OverviewStats({ frame }: { frame: OverviewFrame }) {
  const statuses = overviewStatuses(frame)
  const summaries = ["6 guests", "Comparing", "Preparing"]
  const complete = ["Connected", "Matched", "Prepared"]
  const icons = [Mail, Plane, Users]
  return <>{statuses.map((status, index) => <div key={status.label} className={`mini-stat overview-stat is-${status.state}`}>
    <span className="overview-stat-label">{status.label}<Icon node={icons[index]} /></span>
    <strong className="overview-stat-value" key={`${frame.phase}-${frame.beat}`}>{status.state === "pending" ? "In view" : status.state === "done" ? complete[index] : summaries[index]}</strong>
    <small>{status.state === "pending" ? ["Messages and trip details", "Fleet and availability", "Pilots, dispatch, and FBO"][index] : status.status}</small>
  </div>)}</>
}

function DepartureBrief({ trip }: { trip: OverviewTrip }) {
  return <div className="overview-brief overview-scene-enter">
    <div className="overview-brief-toolbar"><Icon node={FileText} /><span>Departure brief.pdf</span><span>PDF</span></div>
    <div className="overview-brief-page">
      <div className="overview-brief-brand"><img src="/assets/avel-wordmark.png" alt="Avel" /><span>TRIP BRIEF</span></div>
      <h3>{trip.fromCode}<span>to</span>{trip.toCode}</h3>
      <p>{trip.from} to {trip.to}</p>
      <dl>
        <div><dt>Aircraft</dt><dd>{trip.aircraft}</dd></div>
        <div><dt>Departure</dt><dd>{trip.depart} {trip.zone}</dd></div>
        <div><dt>Passengers</dt><dd>6 guests</dd></div>
        <div><dt>Trip distance</dt><dd>{trip.distance}</dd></div>
      </dl>
      <div className="overview-brief-stamp"><span className="overview-square" /> Prepared for your review</div>
    </div>
  </div>
}

type OverviewAssistantProps = {
  trip: OverviewTrip
  frame: OverviewFrame
  running: boolean
  paused: boolean
  reducedMotion: boolean
  onPause: () => void
  onReplay: () => void
}

export function OverviewAssistant({ trip, frame, running, paused, reducedMotion, onPause, onReplay }: OverviewAssistantProps) {
  const scene = scenes[frame.phase]
  const question = overviewQuestion(trip).split(/\s+/).slice(0, frame.questionWords).join(" ")
  const ready = frame.phase === "ready"
  const reply = "The aircraft context and coordination notes are together in one trip brief. Your team has the next step."
  const replyWords = reducedMotion ? 100 : Math.max(1, Math.floor(frame.phaseElapsed / 50))
  return <>
    <header className="overview-assistant-header">
      <div className="overview-assistant-brand"><img src="/assets/avel-mark.png" alt="" /><span>Avel</span><span className="overview-assistant-label">Your operations agent</span></div>
      <div className="overview-playback">
        <button type="button" onClick={onReplay} aria-label="Replay overview demo"><Icon node={RotateCcw} /></button>
        <button type="button" onClick={onPause} aria-label={paused ? "Play overview animation" : "Pause overview animation"} aria-pressed={paused}><Icon node={paused ? Play : Pause} /></button>
      </div>
    </header>
    <div className="overview-assistant-body" data-phase={frame.phase}>
      <div className="overview-scene" key={ready ? "ready" : "working"}>
        {ready ? <DepartureBrief trip={trip} /> : <OverviewFigure frame={frame} running={running} />}
        <div key={`copy-${frame.phase}`} className="overview-scene-copy overview-scene-enter">
          <span className="overview-stage-label"><span className="overview-square" />{ready ? "Ready for review" : frame.phase === "request" ? "Reading the request" : "Avel working"}</span>
          <h3>{scene.title}</h3>
          <p>{ready ? reply.split(/\s+/).slice(0, replyWords).join(" ") : scene.detail}</p>
        </div>
        {!ready && <div className="overview-context" key={`context-${frame.phase}`}>
          <span><Icon node={frame.phase === "aircraft" ? Plane : frame.phase === "coordination" ? Users : FileText} />{frame.phase === "aircraft" ? trip.aircraft : frame.phase === "coordination" ? "Pilots · dispatch · FBO" : `${trip.fromCode} to ${trip.toCode}`}</span>
          <span>{frame.phase === "aircraft" ? trip.distance : "6 guests"}</span>
        </div>}
      </div>
    </div>
    <div className={`assistant-input overview-composer${frame.phase === "request" ? " is-typing" : ""}`} aria-label="Example trip request">
      <span className="overview-request-label">Your request</span>
      <div className="assistant-question" aria-live="off">{question}</div>
      <div className="assistant-controls" aria-hidden="true">
        <span className="assistant-add"><Icon node={Plus} /></span>
        <span className="assistant-chip">Ask Avel<Icon node={ChevronDown} /></span>
        <span className="assistant-control-spacer" />
        <span className={`assistant-submit${frame.phase !== "request" ? " is-sent" : ""}`}><Icon node={ArrowUp} /></span>
      </div>
    </div>
    <div className="assistant-note overview-example-note">Example trip · Your team makes the final call.</div>
  </>
}

export function OverviewMapContext({ trip, frame }: { trip: OverviewTrip; frame: OverviewFrame }) {
  return <div className={`overview-map-context${frame.phase === "request" ? " is-reading" : ""}`}>
    <span className="overview-stage-label"><span className="overview-square" /> Trip context</span>
    <strong key={`${trip.fromCode}-${trip.toCode}`}>{trip.fromCode}<span>to</span>{trip.toCode}</strong>
    <small>{trip.aircraft}</small>
    <span className="overview-map-status" key={frame.phase}>{frame.phase === "ready" ? "Brief prepared" : frame.phase === "coordination" ? "Preparing team updates" : frame.phase === "aircraft" ? "Comparing aircraft" : "Connecting the request"}</span>
  </div>
}
