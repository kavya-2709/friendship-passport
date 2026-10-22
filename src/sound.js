// Tiny Web Audio synth: every sound is generated, so there are no files to load.
let ctx = null
let enabled = false

export function setSound(on) {
  enabled = on
  if (on && !ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
  if (on && ctx.state === 'suspended') ctx.resume()
}
export const soundOn = () => enabled

function tone(freq, dur, { type = 'sine', vol = 0.15, delay = 0, slide = 0 } = {}) {
  if (!enabled || !ctx) return
  const t = ctx.currentTime + delay
  const o = ctx.createOscillator()
  const g = ctx.createGain()
  o.type = type
  o.frequency.setValueAtTime(freq, t)
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, freq + slide), t + dur)
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(vol, t + 0.01)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  o.connect(g).connect(ctx.destination)
  o.start(t)
  o.stop(t + dur + 0.02)
}

function noise(dur, { vol = 0.2, delay = 0, freq = 1200, q = 0.8, type = 'bandpass' } = {}) {
  if (!enabled || !ctx) return
  const t = ctx.currentTime + delay
  const len = Math.floor(ctx.sampleRate * dur)
  const buf = ctx.createBuffer(1, len, ctx.sampleRate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len)
  const src = ctx.createBufferSource()
  src.buffer = buf
  const f = ctx.createBiquadFilter()
  f.type = type
  f.frequency.value = freq
  f.Q.value = q
  const g = ctx.createGain()
  g.gain.value = vol
  src.connect(f).connect(g).connect(ctx.destination)
  src.start(t)
}

const buzz = (ms) => navigator.vibrate?.(ms)

export const sfx = {
  ping: () => { tone(880, 0.18, { vol: 0.12 }); tone(1320, 0.25, { vol: 0.1, delay: 0.09 }) },
  flip: () => noise(0.28, { vol: 0.18, freq: 2500, q: 0.6 }),
  stamp: () => { tone(110, 0.16, { type: 'triangle', vol: 0.35, slide: -60 }); noise(0.08, { vol: 0.25, freq: 400 }); buzz(30) },
  peel: () => noise(0.35, { vol: 0.14, freq: 3500, q: 2 }),
  right: () => { tone(660, 0.12, { vol: 0.12 }); tone(990, 0.2, { vol: 0.12, delay: 0.1 }) },
  wrong: () => { tone(200, 0.22, { type: 'square', vol: 0.06, slide: -70 }); buzz(60) },
  unfold: () => { noise(0.18, { vol: 0.12, freq: 1800 }); noise(0.18, { vol: 0.12, freq: 1500, delay: 0.2 }) },
  print: () => { for (let i = 0; i < 9; i++) noise(0.09, { vol: 0.1, freq: 900 + (i % 2) * 400, q: 4, delay: i * 0.13 }) },
  tear: () => { noise(0.45, { vol: 0.3, freq: 2200, q: 0.5 }); buzz(40) },
  cheer: () => [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.3, { vol: 0.09, delay: i * 0.08 })),
  pop: () => tone(520, 0.08, { vol: 0.1, slide: 300 }),
}
