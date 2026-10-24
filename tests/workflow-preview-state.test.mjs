import test from "node:test"
import assert from "node:assert/strict"
import { workflows } from "../src/workflow-data.ts"
import { workflowSteps, stepDuration } from "../src/workflow-state.ts"
import { previewForStep, previewIsApproved, paymentIsReceived, billingFigures, finalBillTotal, finalBillBalance } from "../src/workflow-preview-state.ts"

test("all seven workflows show task-specific previews with 2.5 seconds per task", () => {
  const finalPreviews = ["quote", "work-order", "brief", "comparison", "payment", "messages", "invoice"]
  workflows.forEach((flow, index) => {
    const steps = workflowSteps(flow)
    assert.equal(previewForStep(flow.key, steps.at(-1)), finalPreviews[index])
    flow.tasks.forEach((_, taskIndex) => {
      const beats = steps.filter((step) => step.kind === "working" && step.task === taskIndex)
      assert.equal(beats.reduce((total, step) => total + stepDuration(step), 0), 2500)
      assert.ok(stepDuration(beats[1]) > stepDuration(beats[0]), "Allow more time to read the result")
    })
  })
  assert.equal(previewForStep("sales", { kind: "working", task: 1, beat: 0 }), "aircraft")
  assert.equal(previewForStep("crew", { kind: "working", task: 0, beat: 1 }), "messages")
  assert.equal(previewForStep("booking", { kind: "working", task: 1, beat: 1 }), "agreement")
  assert.equal(previewForStep("billing", { kind: "working", task: 1, beat: 0 }), "reconcile")
})

test("approval stamps never appear before the team's approval", () => {
  for (const flow of workflows.filter((flow) => flow.review)) {
    let approved = false
    for (const step of workflowSteps(flow)) {
      if (step.kind === "approved") approved = true
      assert.equal(previewIsApproved(flow.key, step), approved, `${flow.key}: ${step.kind}`)
    }
  }
})

test("final invoice excludes the duplicate and applies the received payment", () => {
  assert.equal(finalBillTotal, 51800)
  assert.equal(finalBillBalance, 3200)
  assert.equal(finalBillTotal - billingFigures.flight, 800)
  assert.equal(finalBillTotal, billingFigures.flight + billingFigures.catering + billingFigures.transport)
  assert.equal(finalBillTotal - billingFigures.received, finalBillBalance)
})

test("payment figures update when received funds are verified and reset for the next loop", () => {
  assert.equal(paymentIsReceived({ kind: "working", task: 2, beat: 0 }), false)
  assert.equal(paymentIsReceived({ kind: "working", task: 2, beat: 1 }), true)
  assert.equal(paymentIsReceived({ kind: "working", task: 3, beat: 0 }), true)
  assert.equal(paymentIsReceived({ kind: "complete" }), true)
  assert.equal(paymentIsReceived({ kind: "working", task: 0, beat: 0 }), false)
})
