import test from "node:test"
import assert from "node:assert/strict"
import { overviewDuration, overviewFrame, overviewQuestion, overviewStatuses } from "../src/overview-state.ts"

const trip = {
  from: "Los Angeles",
  to: "San Francisco",
  fromCode: "LAX",
  toCode: "SFO",
  aircraft: "Citation Longitude",
  distance: "337 nm",
  depart: "09:00",
  zone: "PT",
}

test("the request and three tasks transition at their exact boundaries", () => {
  const boundaries = [[0, "request"], [1600, "context"], [4100, "aircraft"], [6600, "coordination"], [9100, "ready"]]
  boundaries.forEach(([start, phase], index) => {
    assert.equal(overviewFrame(start).phase, phase)
    assert.equal(overviewFrame(start).phaseElapsed, 0)
    if (index > 0) assert.equal(overviewFrame(start - 1).phase, boundaries[index - 1][1])
  })
  assert.equal(overviewDuration - 9100, 3000, "The completed brief remains visible for three seconds")
})

test("every task has a one-second first beat and a 1.5-second result beat", () => {
  for (const start of [1600, 4100, 6600]) {
    assert.equal(overviewFrame(start + 999).beat, 0)
    assert.equal(overviewFrame(start + 1000).beat, 1)
    assert.equal(overviewFrame(start + 2499).beat, 1)
    assert.equal(overviewFrame(start + 2499).phaseElapsed, 2499)
  }
  assert.equal(overviewFrame(9100).beat, 1)
})

test("completion holds until the parent selects a new route", () => {
  const final = overviewFrame(overviewDuration)
  assert.deepEqual(final, { phase: "ready", beat: 1, phaseElapsed: 3000, questionWords: 40 })
  assert.deepEqual(overviewFrame(overviewDuration + 1), final)
  assert.deepEqual(overviewFrame(1e12), final)
  assert.deepEqual(overviewFrame(Infinity), final)
})

test("invalid and negative clocks stay finite and never move before the request", () => {
  for (const elapsed of [-1, -Infinity, NaN]) assert.deepEqual(overviewFrame(elapsed), overviewFrame(0))
  for (const elapsed of [-Infinity, -0, 0, 0.5, 1600, 9100, 12100, Infinity, NaN]) {
    const frame = overviewFrame(elapsed)
    assert.ok(Number.isFinite(frame.phaseElapsed) && frame.phaseElapsed >= 0)
    assert.ok(Number.isInteger(frame.questionWords) && frame.questionWords > 0)
  }
})

test("reduced motion immediately shows the full final state at any clock value", () => {
  for (const elapsed of [-Infinity, -10, 0, 3000, 10000, Infinity, NaN]) {
    assert.deepEqual(overviewFrame(elapsed, true), overviewFrame(overviewDuration))
  }
})

test("sampling earlier times after completion rewinds cleanly", () => {
  const request = overviewFrame(0)
  const aircraft = overviewFrame(5200)
  overviewFrame(overviewDuration)
  assert.deepEqual(overviewFrame(5200), aircraft)
  assert.deepEqual(overviewFrame(0), request)
  assert.equal(overviewStatuses(overviewFrame(0)).every((item) => item.state === "pending"), true)
})

test("the concise request names the actual route and reveals fully before work starts", () => {
  const question = overviewQuestion(trip)
  assert.match(question, /from Los Angeles to San Francisco/)
  assert.match(question, /6 guests/)
  for (const subject of ["aircraft", "crew", "ground services"]) assert.ok(question.includes(subject))
  const words = question.split(/\s+/)
  assert.ok(words.length >= 21 && words.length <= 26)
  assert.ok(overviewFrame(1599).questionWords >= words.length)
  assert.ok(overviewFrame(0).questionWords < overviewFrame(800).questionWords)
  assert.notEqual(overviewQuestion({ ...trip, from: "London", to: "Paris" }), question)
})

test("statuses progress through both beats and leave three reviewable drafts", () => {
  assert.deepEqual(overviewStatuses(overviewFrame(0)).map((item) => item.state), ["pending", "pending", "pending"])
  for (const [index, start] of [1600, 4100, 6600].entries()) {
    const first = overviewStatuses(overviewFrame(start))
    const second = overviewStatuses(overviewFrame(start + 1000))
    assert.equal(first[index].state, "active")
    assert.notEqual(first[index].status, second[index].status)
    assert.ok(first.slice(0, index).every((item) => item.state === "done"))
    assert.ok(first.slice(index + 1).every((item) => item.state === "pending"))
  }
  const done = overviewStatuses(overviewFrame(9100))
  assert.ok(done.every((item) => item.state === "done" && item.status.endsWith("drafted")))
  assert.deepEqual(done.map((item) => item.label), ["Trip context", "Aircraft options", "Crew & ground"])
})
