import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { sfx } from '../sound.js'
import './note.css'

export default function Note({ c, next }) {
  const n = c.note
  const [open, setOpen] = useState(false)
  const pull = () => { if (!open) { sfx.unfold(); setOpen(true) } }

  return (
    <div className="scene note-scene">
      <AnimatePresence mode="wait">
        {!open ? (
          <motion.div key="pocket" className="pocket-wrap" exit={{ opacity: 0, y: 60, transition: { duration: 0.35 } }}>
            <div className="back-cover">
              <motion.div className="peek"
                drag="y" dragConstraints={{ top: 0, bottom: 0 }} dragElastic={0.5}
                onDragEnd={(_, i) => { if (i.offset.y < -30) pull() }}
                onTap={pull}
                animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}
                role="button" aria-label={`Letter from ${c.sender}. Tap to open.`}>
                <span>for {c.receiver} 💌</span>
              </motion.div>
              <div className="pocket"><span>{c.cover.title}</span></div>
            </div>
            <p className="hint">{n.hint}</p>
          </motion.div>
        ) : (
          <motion.div key="letter" className="letter"
            initial={{ scaleY: 0.15, y: 140, opacity: 0.6 }} animate={{ scaleY: 1, y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 120, damping: 18 }} style={{ transformOrigin: 'top' }}>
            {n.lines.map((l, k) => (
              <motion.p key={k} className={k === 0 ? 'salute' : ''} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + k * 0.55 }}>{l}</motion.p>
            ))}
            <motion.p className="signoff" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 + n.lines.length * 0.55 }}>{n.signoff}</motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bottom">
        {open && (
          <motion.button className="btn btn-primary" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 + n.lines.length * 0.55 }} onClick={next}>
            {n.cta}
          </motion.button>
        )}
      </div>
    </div>
  )
}
