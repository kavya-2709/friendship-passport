import { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Kritika, Kavya } from '../components/Avatars.jsx'
import { sfx } from '../sound.js'
import './journey.css'

// Trail geometry in a 340 × 1250 page. Stops alternate left/right; then the
// path splits into two branches (her city / my city) that meet at "next stop?".
const W = 340, H = 1250
const STOPS = [[80, 210], [260, 430], [80, 650], [260, 860]]
const MAIN = 'M170 120 C170 160 80 160 80 210 C80 310 260 330 260 430 C260 530 80 550 80 650 C80 750 260 770 260 860 C260 910 170 910 170 960'
const LEFT = 'M170 960 C170 1010 58 1020 58 1070 C58 1130 170 1140 170 1190'
const RIGHT = 'M170 960 C170 1010 282 1020 282 1070 C282 1130 170 1140 170 1190'
const SPLIT_AT = 0.74 // share of scroll spent on the shared trail
const INK = { blue: 'var(--s-blue)', pink: 'var(--s-pink)', purple: 'var(--s-purple)', green: 'var(--s-green)' }
const pct = (x, y) => ({ left: `${(x / W) * 100}%`, top: `${(y / H) * 100}%` })

export default function Journey({ c, next }) {
  const j = c.journey
  const scroller = useRef(null)
  const main = useRef(null), left = useRef(null), right = useRef(null)
  const [p, setP] = useState(0)
  const [pos, setPos] = useState({ duo: [170, 120], a: null, b: null })
  const stamped = useRef(new Set())
  const [shown, setShown] = useState(new Set())

  const update = () => {
    const el = scroller.current
    if (!el || !main.current) return
    const range = el.scrollHeight - el.clientHeight
    const prog = range > 0 ? Math.min(1, Math.max(0, el.scrollTop / range)) : 0
    setP(prog)
    if (prog < SPLIT_AT) {
      const L = main.current.getTotalLength()
      const pt = main.current.getPointAtLength((prog / SPLIT_AT) * L)
      setPos({ duo: [pt.x, pt.y], a: null, b: null })
      STOPS.forEach(([, y], n) => {
        if (pt.y >= y - 6 && !stamped.current.has(n)) {
          stamped.current.add(n)
          setShown(new Set(stamped.current))
          sfx.stamp()
        }
      })
    } else {
      const q = (prog - SPLIT_AT) / (1 - SPLIT_AT)
      const la = left.current.getPointAtLength(q * left.current.getTotalLength())
      const rb = right.current.getPointAtLength(q * right.current.getTotalLength())
      STOPS.forEach((_, n) => stamped.current.add(n))
      setShown(new Set(stamped.current))
      setPos(q > 0.97 ? { duo: [170, 1190], a: null, b: null } : { duo: null, a: [la.x, la.y], b: [rb.x, rb.y] })
    }
  }

  useLayoutEffect(update, [])
  useEffect(() => { if (p > 0.985) sfx.cheer() }, [p > 0.985])

  const q = p < SPLIT_AT ? 0 : (p - SPLIT_AT) / (1 - SPLIT_AT)
  const mainDrawn = Math.min(1, p / SPLIT_AT)
  const atEnd = p > 0.985

  return (
    <div className="journey guil">
      <div className="jr-scroll" ref={scroller} onScroll={() => requestAnimationFrame(update)}>
        <div className="jr-head">
          <h1 className="h1">{j.title}</h1>
          <motion.p className="sub" animate={{ y: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.4 }}>{j.hint}</motion.p>
        </div>

        <div className="jr-page" style={{ aspectRatio: `${W} / ${H}` }}>
          <svg viewBox={`0 0 ${W} ${H}`} className="jr-svg" fill="none">
            <defs>
              <radialGradient id="glow"><stop offset="0" stopColor="#E9B949" stopOpacity=".6" /><stop offset="1" stopColor="#E9B949" stopOpacity="0" /></radialGradient>
            </defs>
            {/* faint full route */}
            <path ref={main} d={MAIN} stroke="#9A6240" strokeOpacity=".28" strokeWidth="3" strokeDasharray="7 8" strokeLinecap="round" />
            <path ref={left} d={LEFT} stroke="#2F6DB5" strokeOpacity=".25" strokeWidth="3" strokeDasharray="5 8" strokeLinecap="round" />
            <path ref={right} d={RIGHT} stroke="#D92D68" strokeOpacity=".25" strokeWidth="3" strokeDasharray="5 8" strokeLinecap="round" />
            {/* travelled */}
            <motion.path d={MAIN} stroke="#9A6240" strokeWidth="3.5" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: mainDrawn }} transition={{ duration: 0.15 }} />
            <motion.path d={LEFT} stroke="#2F6DB5" strokeWidth="3" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: q, opacity: q > 0 ? 1 : 0 }} transition={{ duration: 0.15 }} />
            <motion.path d={RIGHT} stroke="#D92D68" strokeWidth="3" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: q, opacity: q > 0 ? 1 : 0 }} transition={{ duration: 0.15 }} />
            {/* next stop */}
            <circle cx="170" cy="1190" r={atEnd ? 46 : 30} fill="url(#glow)" style={{ transition: 'r .6s' }} />
            <circle cx="170" cy="1190" r="20" fill="#E9B949" stroke="#fff" strokeWidth="4" />
          </svg>

          <div className="jr-start" style={pct(170, 104)}>start</div>

          {j.stops.map((s, n) => {
            const [x, y] = STOPS[n]
            const onLeft = x < W / 2
            const on = shown.has(n)
            return (
              <Fragment key={s.year}>
                <div className="stop-slot" style={pct(x, y)}>
                  <AnimatePresence>
                    {on && (
                      <motion.div className="stop stamp-ink" style={{ color: INK[s.ink] }}
                        initial={{ scale: 1.7, opacity: 0, rotate: onLeft ? -24 : 24 }}
                        animate={{ scale: 1, opacity: 0.92, rotate: onLeft ? -9 : 8 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 18 }}>
                        <b>{s.place}</b><span>{s.year}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {!on && <div className="stop-empty">{s.year}</div>}
                </div>
                <AnimatePresence>
                  {on && (
                    <div className="memo-slot" style={pct(onLeft ? 236 : 104, y - 34)} key="m">
                      <motion.div className={`memo ${onLeft ? 'right' : 'left'}`}
                        initial={{ opacity: 0, y: 16, rotate: 0 }} animate={{ opacity: 1, y: 0, rotate: onLeft ? 3 : -3 }}
                        transition={{ delay: 0.15, type: 'spring', stiffness: 200, damping: 16 }}>
                        <span className="tape" />
                        <div className="memo-pic"><img src={s.img} alt={s.alt} loading="lazy" /></div>
                        <p>{s.line}</p>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>
              </Fragment>
            )
          })}

          {/* the split */}
          <motion.p className="split-line" style={pct(170, 948)} animate={{ opacity: p > SPLIT_AT - 0.04 ? 1 : 0 }}>{j.split}</motion.p>
          <motion.div className="city left" style={pct(58, 1070)} animate={{ opacity: q > 0.15 ? 1 : 0 }}><b>{c.receiver.toUpperCase()}</b>{j.cityThem}</motion.div>
          <motion.div className="city right" style={pct(282, 1070)} animate={{ opacity: q > 0.15 ? 1 : 0 }}><b>{c.sender.toUpperCase()}</b>{j.cityYou}</motion.div>
          <div className="gap-slot" style={pct(170, 1068)}>
            <motion.div className="gap" animate={{ opacity: q > 0.3 ? 1 : 0, scale: q > 0.3 ? 1 : 0.8 }}>
              <b>{j.days} days</b><span>{j.km} KM</span>
            </motion.div>
          </div>
          <div style={pct(170, 1232)}><motion.p className="next-label" animate={{ scale: atEnd ? 1.15 : 1 }}>{j.next}</motion.p></div>
          <div className="next-icon" style={pct(170, 1190)}>🎟️</div>

          {/* travellers */}
          {pos.duo && (
            <motion.div className={`duo ${atEnd ? 'met' : ''}`} style={pct(...pos.duo)}>
              <Kritika size={26} /><Kavya size={26} />
            </motion.div>
          )}
          {pos.a && <div className="solo" style={pct(...pos.a)}><Kritika size={26} /></div>}
          {pos.b && <div className="solo" style={pct(...pos.b)}><Kavya size={26} /></div>}
        </div>
        <p className="jr-credits">{j.credits}</p>
        <div style={{ height: 96 }} />
      </div>

      <AnimatePresence>
        {atEnd && (
          <motion.div className="jr-cta" initial={{ y: 90 }} animate={{ y: 0 }} exit={{ y: 90 }} transition={{ type: 'spring', stiffness: 260, damping: 24 }}>
            <button className="btn btn-primary" onClick={next}>{j.cta}</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
