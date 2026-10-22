import { motion } from 'framer-motion'
import { Kritika } from '../components/Avatars.jsx'
import './reminder.css'

export default function Reminder({ c, next }) {
  const r = c.reminder
  return (
    <div className="scene reminder">
      <div className="rm-stage">
        <motion.div
          className="story"
          initial={{ opacity: 0, y: 30, rotate: 2 }}
          animate={{ opacity: 1, y: 0, rotate: -2 }}
          transition={{ type: 'spring', stiffness: 120, damping: 16 }}
        >
          <img className="story-photo" src={r.photo} alt={r.photoAlt} />
          <div className="bars"><motion.i initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 5, ease: 'linear' }} /><i /><i /></div>
          <div className="who"><span><Kritika size={22} /></span>{r.who}</div>
          <motion.div className="loc" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.6, type: 'spring', stiffness: 300, damping: 14 }}>
            📍 {r.location}
          </motion.div>
        </motion.div>

        <motion.div className="scribble" initial={{ opacity: 0, scale: 1.4, rotate: -14 }} animate={{ opacity: 1, scale: 1, rotate: -7 }} transition={{ delay: 1.1, type: 'spring', stiffness: 260, damping: 15 }}>
          {r.scribble}
          <small>{r.scribble2}</small>
        </motion.div>
        <svg className="arrow" viewBox="0 0 60 156" fill="none" stroke="#D92D68" strokeWidth="3" strokeLinecap="round">
          <motion.path d="M40 4 C 62 60, 44 112, 16 146" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.5, duration: 0.6 }} />
          <motion.path d="M16 146 l 2 -17 M16 146 l 15 -7" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.05 }} />
        </svg>
      </div>

      <motion.div className="bottom" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.3 }}>
        <p className="rm-line">{r.line}</p>
        <button className="btn btn-primary" onClick={next}>{r.cta}</button>
      </motion.div>
    </div>
  )
}
