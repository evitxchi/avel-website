import type { Workflow } from "./workflow-data"

export type WorkflowStep =
  | { kind: "working"; task: number; beat: number }
  | { kind: "review"; task: number }
  | { kind: "approved"; task: number }
  | { kind: "complete" }

export function workflowSteps(flow: Workflow): WorkflowStep[] {
  const steps: WorkflowStep[] = []
  flow.tasks.forEach((task, index) => {
    task.working.forEach((_, beat) => steps.push({ kind: "working", task: index, beat }))
    if (flow.review?.afterTask === index) {
      steps.push({ kind: "review", task: index }, { kind: "approved", task: index })
    }
  })
  return [...steps, { kind: "complete" }]
}

export function taskState(flow: Workflow, step: WorkflowStep, index: number) {
  const task = flow.tasks[index]
  const done = step.kind === "complete" || index < step.task || (step.kind === "approved" && index === step.task)
  const active = step.kind === "working" && index === step.task
  const review = step.kind === "review" && index === step.task
  const status = done ? task.done : review ? "Your review" : active ? task.working[step.beat] : index === step.task + 1 ? "Up next" : "Pending"
  return { done, active, review, status }
}

export function stepDuration(step: WorkflowStep): number {
  if (step.kind === "complete") return 2200
  if (step.kind === "review") return 1500
  if (step.kind === "approved") return 600
  return step.beat === 0 ? 1000 : 1500
}

export function workflowAtProgress(progress: number, count: number): number {
  return Math.min(count - 1, Math.floor(Math.max(0, Math.min(1, progress)) * count))
}
