import { test } from "node:test"
import assert from "node:assert/strict"
import { moduleFrame, flightPosition } from "../src/module-sequence.ts"

test("all six module stages get 2.5 seconds, including the completed proposal", () => {
  for (let step = 0; step < 6; step++) {
    assert.deepEqual(moduleFrame(step * 2500, 6), { step, progress: 0 })
    assert.equal(moduleFrame(step * 2500 + 2499, 6).step, step)
  }
  assert.deepEqual(moduleFrame(15000, 6), { step: 0, progress: 0 })
})
test("hidden time cannot cause invalid stages and reduced motion shows the completed record", () => {
  for (const time of [-100, NaN, Infinity]) assert.deepEqual(moduleFrame(time, 6), { step: 0, progress: 0 })
  assert.deepEqual(moduleFrame(0, 6, true), { step: 5, progress: 1 })
  assert.deepEqual(moduleFrame(0, 4, true), { step: 3, progress: 1 })
})
test("the aircraft visits each card, then holds for reading", () => {
  assert.equal(flightPosition(0, 0), 100)
  for (let step = 1; step < 4; step++) {
    assert.ok(Math.abs(flightPosition(step, 0) - (100 + (step - 1) * 800 / 3)) < .001)
    assert.ok(Math.abs(flightPosition(step, .42) - (100 + step * 800 / 3)) < .001)
    assert.equal(flightPosition(step, .42), flightPosition(step, .99))
    assert.ok(flightPosition(step, .1) < flightPosition(step, .3))
  }
  assert.equal(flightPosition(3, 1), 900)
})
