import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { sfx } from '../sound.js'
import './visas.css'

const BG = { lilac: '#DCCDF7', butter: '#FFD873', mint: '#BFE8CF' }

export default function Visas({ c, next }) {
  const v = c.visas
  const [peeled, setPeeled] = useState([])
  const peel = (n) => {
    if (peeled.includes(n)) return
    sfx.peel()
    setPeeled((p) => [...p, n])
  }
  const done = peeled.length === v.items.length

  return (
    <div className="scene guil">
      <h1 className="h1">{v.title}</h1>
      <p className="sub">{done ? v.done : v.hint}</p>

      <div className="visas">
        {v.items.map((it, n) => (
          <motion.div key={it.type} className="visa" style={{ '--bg': BG[it.color], rotate: [-2, 1.5, -1][n] }}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + n * 0.12 }}>
            <div className="visa-in">
              <div className="visa-top"><span className="lbl">Visa type</span><span className="lbl">Nº 0{n + 1}</span></div>
              <b>{it.type}</b>
              <p>{it.detail}</p>
              <span className="valid stamp-ink">VALID ✓</span>
            </div>
            <AnimatePresence>
              {!peeled.includes(n) && (
                <motion.button
                  className="seal-cover"
                  aria-label={`Hidden inside joke ${n + 1}. Tap to peel.`}
                  drag dragSnapToOrigin dragElastic={0.4}
                  onDragEnd={(_, i) => { if (Math.hypot(i.offset.x, i.offset.y) > 36) peel(n) }}
                  onTap={() => peel(n)}
                  exit={{ x: 280, y: -140, rotate: 28, opacity: 0, transition: { duration: 0.5, ease: 'easeIn' } }}
                >
                  <span className="sc-mark">?</span>
                  <span className="sc-text">SEALED · ONLY-US</span>
                  <span className="curl" />
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <div className="bottom">
        <AnimatePresence>
          {done && <motion.button className="btn btn-primary" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onClick={next}>{v.cta}</motion.button>}
        </AnimatePresence>
      </div>
    </div>
  )
}
