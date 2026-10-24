import test from "node:test"
import assert from "node:assert/strict"
import { existsSync } from "node:fs"
import { overviewAircraft, aircraftScrollProgress } from "../src/overview-aircraft.ts"

test("aircraft carousel uses distinct named aircraft and local photography", () => {
  assert.equal(new Set(overviewAircraft.map((aircraft) => aircraft.registration)).size, 3)
  for (const aircraft of overviewAircraft) {
    assert.ok(aircraft.name && aircraft.registration)
    assert.ok(existsSync(new URL(`../public${aircraft.image}`, import.meta.url)))
  }
  assert.ok(existsSync(new URL("../public/assets/avinode-logotype.png", import.meta.url)))
})

test("carousel moves within the 2.5-second aircraft stage and holds both ends", () => {
  assert.equal(aircraftScrollProgress(0), 0)
  assert.equal(aircraftScrollProgress(500), 0)
  assert.equal(aircraftScrollProgress(1300), 0.5)
  assert.equal(aircraftScrollProgress(2100), 1)
  assert.equal(aircraftScrollProgress(2500), 1)
  let previous = 0
  for (let elapsed = 0; elapsed <= 2500; elapsed += 50) {
    const current = aircraftScrollProgress(elapsed)
    assert.ok(current >= previous && current >= 0 && current <= 1)
    previous = current
  }
  assert.equal(aircraftScrollProgress(NaN), 0)
  assert.equal(aircraftScrollProgress(-Infinity), 0)
  assert.equal(aircraftScrollProgress(Infinity), 1)
})
