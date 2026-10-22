import { useState } from 'react'
import { motion, animate, useMotionValue, useTransform, useReducedMotion } from 'framer-motion'
import { sfx } from '../sound.js'
import './cover.css'

const EASE = [0.2, 0.7, 0.2, 1]

export default function Cover({ c, next }) {
  const k = c.cover
  const still = useReducedMotion()
  const [opening, setOpening] = useState(false)
  const rot = useMotionValue(0) // cover hinge angle, 0 → -180
  const lift = useTransform(rot, [0, -90], [0, 1])
  const shadow = useTransform(lift, (v) => `0 ${30 + v * 20}px ${50 + v * 30}px -24px rgba(0,0,0,${0.65 + v * 0.15})`)
  const sheen = useTransform(rot, [0, -70], [0, 0.22])

  const open = (why) => {
    if (opening) return
    setOpening(true)
    sfx.flip()
    animate(rot, -180, { duration: still ? 0.01 : 0.9, ease: [0.45, 0, 0.2, 1], onComplete: () => setTimeout(next, still ? 0 : 450) })
  }

  return (
    <div className="scene s2">
      <motion.div className="s2-stage"
        initial={still ? false : { opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.15, ease: EASE }}>
        <div className="book" aria-label="Friendship Passport. Tap or swipe to open." role="button" tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && open('key')}>
          {/* first inside page, revealed as the cover lifts */}
          <div className="leaf">
            <span className="meta leaf-meta">{k.inside}</span>
            <span className="leaf-name">{k.first}</span>
            <span className="leaf-rule" />
            <span className="meta">{k.serial}</span>
          </div>

          <motion.div className="cover-3d" style={{ rotateY: rot, boxShadow: shadow }}
            onPan={(_, i) => { if (!opening) rot.set(Math.max(-75, Math.min(0, i.offset.x * 0.45))) }}
            onPanEnd={(_, i) => { if (opening) return; if (i.offset.x < -50 || i.velocity.x < -400) open('pan'); else animate(rot, 0, { type: 'spring', stiffness: 260, damping: 22 }) }}
            onTap={() => open('tap')}>
            <div className="face front">
              <span className="frame" aria-hidden="true" />
              <span className="cv-kicker">{k.title}</span>
              <Seal ring={k.ring} />
              <h2 className="cv-names">
                <span>{k.first}</span>
                <em>&amp;</em>
                <span>{k.second}</span>
              </h2>
              <div className="cv-foot">
                <span>{k.serial}</span>
                <Chip />
              </div>
              <motion.span className="sheen" style={{ opacity: sheen }} aria-hidden="true" />
            </div>
            <div className="face back" aria-hidden="true">
              <span className="meta">Issued in Allahabad</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <motion.button className="s2-hint" onClick={() => open('hint')}
        initial={still ? false : { opacity: 0 }} animate={{ opacity: opening ? 0 : 1 }} transition={{ delay: opening ? 0 : 1.2, duration: 0.5 }}>
        <span className="hint-rule" aria-hidden="true" />
        {k.hint}
      </motion.button>
    </div>
  )
}

// Bespoke friendship seal: two interlocking rings, the year, a ring of names.
function Seal({ ring }) {
  return (
    <svg className="cv-seal" viewBox="0 0 120 120" aria-hidden="true">
      <defs><path id="ringPath" d="M60 60 m-47 0 a47 47 0 1 1 94 0 a47 47 0 1 1 -94 0" /></defs>
      <circle cx="60" cy="60" r="57" fill="none" stroke="currentColor" strokeWidth="0.8" />
      <circle cx="60" cy="60" r="38" fill="none" stroke="currentColor" strokeWidth="0.8" />
      <text fontSize="6.4" fill="currentColor" fontFamily="DM Sans, sans-serif" fontWeight="600">
        <textPath href="#ringPath" startOffset="0" textLength="292" lengthAdjust="spacing">{ring}</textPath>
      </text>
      <circle cx="51" cy="62" r="13" fill="none" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="69" cy="62" r="13" fill="none" stroke="currentColor" strokeWidth="1.3" />
      <path d="M60 36 l1.6 4.2 4.4 .2 -3.5 2.7 1.2 4.3 -3.7 -2.5 -3.7 2.5 1.2 -4.3 -3.5 -2.7 4.4 -.2z" fill="currentColor" />
      <text x="60" y="88" textAnchor="middle" fontSize="7" letterSpacing="1.6" fill="currentColor" fontFamily="DM Sans, sans-serif" fontWeight="600">2016</text>
    </svg>
  )
}

function Chip() {
  return (
    <svg className="chip-mark" viewBox="0 0 28 20" aria-hidden="true">
      <rect x="0.6" y="0.6" width="26.8" height="18.8" rx="4" fill="none" stroke="currentColor" strokeWidth="1" />
      <path d="M9 1v18M19 1v18M1 10h8M19 10h8M9 6.5h10M9 13.5h10" stroke="currentColor" strokeWidth="0.8" fill="none" />
    </svg>
  )
}
