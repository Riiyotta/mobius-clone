// Framer/Motion duration-based spring with bounce 0 = critically damped.
// x(t) = 1 - e^(-wt)(1 + wt); w chosen so the residual is 0.001 at t = duration
// (Motion's settle threshold). Verified against the "Work" letter samples in the spec.
const U = 9.233 // solves e^-u (1+u) = 0.001

export function springEase(duration, samples = 40) {
  const pts = []
  for (let i = 0; i <= samples; i++) {
    const u = (i / samples) * U
    const v = i === samples ? 1 : 1 - Math.exp(-u) * (1 + u)
    pts.push(+v.toFixed(4))
  }
  return `linear(${pts.join(', ')})`
}

export const SPRING_04 = springEase(0.4)
export const SPRING_06 = springEase(0.6)
export const SPRING_08 = springEase(0.8)
