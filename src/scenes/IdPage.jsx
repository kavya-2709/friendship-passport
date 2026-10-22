import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Kritika } from '../components/Avatars.jsx'
import { sfx } from '../sound.js'
import './id.css'

export default function IdPage({ c, next }) {
  const d = c.id
  const [revealed, setRevealed] = useState(false)
  const [hasTilt, setHasTilt] = useState(false)
  const travel = useRef(0)
  const last = useRef(null)
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const sx = useSpring(mx, { stiffness: 120, damping: 18 })
  const sy = useSpring(my, { stiffness: 120, damping: 18 })
  const bgPos = useTransform([sx, sy], ([x, y]) => `${x * 100}% ${y * 100}%`)

  const feed = (x, y) => {
    mx.set(x); my.set(y)
    if (last.current) travel.current += Math.hypot(x - last.current[0], y - last.current[1])
    last.current = [x, y]
    if (!revealed && travel.current > 1.6) { setRevealed(true); sfx.stamp() }
  }

  useEffect(() => {
    const onTilt = (e) => {
      if (e.gamma == null) return
      setHasTilt(true)
      feed(Math.min(1, Math.max(0, (e.gamma + 30) / 60)), Math.min(1, Math.max(0, (e.beta - 20) / 60)))
    }
    window.addEventListener('deviceorientation', onTilt)
    return () => window.removeEventListener('deviceorientation', onTilt)
  })

  const askTilt = () => {
    const D = window.DeviceOrientationEvent
    if (D && typeof D.requestPermission === 'function') D.requestPermission().catch(() => {})
  }

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    feed((e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height)
  }

  return (
    <div className="scene guil id-scene">
      <div className="id-head"><span className="lbl">{c.cover.title}</span><span className="lbl">{d.number}</span></div>

      <div className="photo" onPointerDown={askTilt} onPointerMove={onMove} role="img" aria-label="Kritika's passport photo with a hidden hologram. Move your finger over it to reveal.">
        <Kritika size={190} style={{ marginBottom: -26 }} />
        <motion.div className="holo" style={{ backgroundPosition: bgPos }} />
        {revealed && (
          <motion.div className="seal" initial={{ scale: 1.8, opacity: 0, rotate: -20 }} animate={{ scale: 1, opacity: 1, rotate: -9 }} transition={{ type: 'spring', stiffness: 400, damping: 16 }}>
            {d.seal}
          </motion.div>
        )}
      </div>

      <div className="fields">
        {d.fields.map((f, n) => (
          <motion.div key={f.label} className="field" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + n * 0.15 }}>
            <span className="lbl">{f.label}</span>
            <span className="val">{f.value}</span>
          </motion.div>
        ))}
        <motion.div className="field" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.95 }}>
          <span className="lbl">Valid until</span>
          <span className="val red">{d.valid}</span>
        </motion.div>
      </div>

      <div className="bottom">
        {revealed ? (
          <>
            <motion.p className="hint" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>{d.after}</motion.p>
            <motion.button className="btn btn-primary" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} onClick={next}>Next →</motion.button>
          </>
        ) : (
          <motion.p className="hint" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}>
            {hasTilt ? d.hint : d.hintDrag}
          </motion.p>
        )}
      </div>
    </div>
  )
}
