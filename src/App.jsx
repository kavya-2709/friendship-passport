import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { card } from './content.js'
import { setSound, soundOn, sfx } from './sound.js'
import Reminder from './scenes/Reminder.jsx'
import Cover from './scenes/Cover.jsx'
import IdPage from './scenes/IdPage.jsx'
import Journey from './scenes/Journey.jsx'
import Visas from './scenes/Visas.jsx'
import Quiz from './scenes/Quiz.jsx'
import Note from './scenes/Note.jsx'
import Ticket from './scenes/Ticket.jsx'

const SCENES = [Reminder, Cover, IdPage, Journey, Visas, Quiz, Note, Ticket]
const DARK = new Set([1]) // cover scene sits on plum

export default function App() {
  // ?s=3 jumps straight to a scene (handy for review and testing)
  const [i, setI] = useState(() => Math.min(SCENES.length - 1, Number(new URLSearchParams(location.search).get('s')) || 0))
  const [sound, setSoundState] = useState(false)

  const toggleSound = () => {
    const on = !soundOn()
    setSound(on)
    setSoundState(on)
    if (on) sfx.pop()
  }
  const next = () => {
    if (i === 0 && !soundOn()) { setSound(true); setSoundState(true) }
    setI((n) => Math.min(n + 1, SCENES.length - 1))
  }
  const replay = () => setI(0)
  const Scene = SCENES[i]

  return (
    <div className="stage">
      <div className="device">
        <div className="topbar">
          <div className={`dots ${DARK.has(i) ? 'light' : ''}`} aria-label={`Page ${i + 1} of ${SCENES.length}`}>
            {SCENES.map((_, n) => <i key={n} className={n === i ? 'on' : ''} />)}
          </div>
          <button className="icon-btn" onClick={toggleSound} aria-label={sound ? 'Sound on' : 'Sound off'}>
            {sound ? '🔊' : '🔇'}
          </button>
        </div>
        <AnimatePresence initial={false}>
          <motion.div
            key={i}
            style={{ position: 'absolute', inset: 0 }}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10, transition: { duration: 0.25 } }}
            transition={{ duration: 0.4, ease: [0.2, 0.7, 0.2, 1] }}
          >
            <Scene c={card} next={next} replay={replay} />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="desk-note">best on your phone 📱 but this works too</div>
      <div className="rotate" role="alert"><i>📱</i><b>Passports are read upright</b><span>turn your phone back, it's better this way</span></div>
    </div>
  )
}
