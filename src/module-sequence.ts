export const moduleStepDuration = 2500

/** Every beat gets a reading hold; looping never produces an out-of-range stage. */
export function moduleFrame(elapsed: number, steps: number, reduced = false) {
  const count = Math.max(1, Math.floor(steps))
  if (reduced) return { step: count - 1, progress: 1 }
  const time = Math.max(0, Number.isFinite(elapsed) ? elapsed : 0) % (count * moduleStepDuration)
  return { step: Math.floor(time / moduleStepDuration), progress: (time % moduleStepDuration) / moduleStepDuration }
}

/** Smooth travel followed by a long hold underneath each coordination card. */
export function flightPosition(step: number, progress: number) {
  const target = Math.min(3, Math.max(0, step))
  const t = Math.min(1, Math.max(0, progress / .42))
  const ease = 1 - Math.pow(1 - t, 3)
  return 100 + (target === 0 ? 0 : (target - 1 + ease) * 800 / 3)
}
