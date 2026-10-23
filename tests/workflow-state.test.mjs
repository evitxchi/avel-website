import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync, existsSync } from "node:fs"
import { workflows } from "../src/workflow-data.ts"
import { workflowSteps, taskState, stepDuration, workflowAtProgress } from "../src/workflow-state.ts"

test("every workflow is reachable from a matching tab and scroll position", () => {
  const html = readFileSync(new URL("../index.html", import.meta.url), "utf8")
  const tabs = [...html.matchAll(/id="flow-tab-([^"]+)"[^>]+data-flow-tab="(\d+)"/g)]
  assert.equal(workflows.length, 7)
  assert.deepEqual(tabs.map((match) => match[1]), workflows.map((flow) => flow.key))
  workflows.forEach((_, index) => {
    assert.equal(Number(tabs[index][2]), index)
    assert.equal(workflowAtProgress((index + 0.15) / workflows.length, workflows.length), index)
  })
  assert.equal(workflowAtProgress(-1, workflows.length), 0)
  assert.equal(workflowAtProgress(2, workflows.length), 6)
})

test("all animation sequences finish, reset, and never show an active task as done", () => {
  for (const flow of workflows) {
    const steps = workflowSteps(flow)
    assert.equal(steps[0].kind, "working")
    assert.equal(steps.at(-1).kind, "complete")
    for (const step of steps) {
      const states = flow.tasks.map((_, index) => taskState(flow, step, index))
      assert.ok(stepDuration(step) > 0)
      assert.ok(states.every((state) => !(state.done && (state.active || state.review))), flow.key)
      assert.ok(states.every((state) => typeof state.status === "string" && state.status.length > 0), flow.key)
      assert.equal(states.filter((state) => state.active).length, step.kind === "working" ? 1 : 0)
      if (step.kind === "complete") assert.ok(states.every((state) => state.done), flow.key)
    }
    assert.ok(flow.tasks.every((_, index) => !taskState(flow, steps[0], index).done), flow.key)
  }
})

test("review workflows wait for approval before starting subsequent actions", () => {
  for (const flow of workflows.filter((entry) => entry.review)) {
    const steps = workflowSteps(flow)
    const reviewIndex = steps.findIndex((step) => step.kind === "review")
    assert.equal(steps[reviewIndex + 1].kind, "approved", flow.key)
    assert.equal(taskState(flow, steps[reviewIndex], flow.review.afterTask).review, true)
    const laterTasks = steps.filter((step) => step.kind === "working" && step.task > flow.review.afterTask)
    assert.ok(laterTasks.every((step) => steps.indexOf(step) > reviewIndex + 1), flow.key)
  }
})

test("all client portraits and integration logos exist locally", () => {
  for (const flow of workflows) {
    const sources = [flow.avatar, flow.sourceBrand.src, ...flow.tasks.map((task) => task.brand?.src)].filter(Boolean)
    for (const source of sources) {
      assert.ok(existsSync(new URL(`../public${source}`, import.meta.url)), `${flow.key}: ${source}`)
    }
  }
})
