import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { sfx } from '../sound.js'
import './quiz.css'

export default function Quiz({ c, next }) {
  const z = c.quiz
  const [qi, setQi] = useState(0)
  const [wrong, setWrong] = useState(null)
  const [right, setRight] = useState(null)
  const [reaction, setReaction] = useState('')
  const firstTry = useRef(0)
  const missed = useRef(false)
  const done = qi >= z.questions.length

  const pick = (n) => {
    if (right != null) return
    const q = z.questions[qi]
    if (n === q.answer) {
      sfx.right()
      if (!missed.current) firstTry.current++
      setRight(n)
      setReaction(z.right[qi % z.right.length])
      setTimeout(() => { setQi((x) => x + 1); setRight(null); setWrong(null); setReaction(''); missed.current = false }, 1100)
    } else {
      sfx.wrong()
      missed.current = true
      setWrong(n)
      setReaction(z.wrong[Math.floor(Math.random() * z.wrong.length)])
      setTimeout(() => setWrong(null), 450)
    }
  }

  return (
    <div className="scene guil">
      <h1 className="h1">{z.title}</h1>
      {!done && <p className="sub">{qi + 1} / {z.questions.length}</p>}

      <div className="quiz-area">
        <AnimatePresence mode="wait">
          {!done ? (
            <motion.div key={qi} className="q-card" initial={{ opacity: 0, x: 40, rotate: 2 }} animate={{ opacity: 1, x: 0, rotate: 0 }} exit={{ opacity: 0, x: -40, rotate: -2 }}>
              <p className="q">{z.questions[qi].q}</p>
              <div className="opts">
                {z.questions[qi].options.map((o, n) => (
                  <motion.button key={o}
                    className={`opt ${right === n ? 'is-right' : ''} ${wrong === n ? 'is-wrong' : ''}`}
                    animate={wrong === n ? { x: [0, -8, 8, -5, 5, 0] } : { x: 0 }}
                    transition={{ duration: 0.4 }}
                    onClick={() => pick(n)}
                    aria-label={`Answer ${String.fromCharCode(65 + n)}: ${o}`}>
                    <span className="opt-letter">{String.fromCharCode(65 + n)}</span>{o}
                  </motion.button>
                ))}
              </div>
              <p className="reaction" aria-live="polite">{reaction}</p>
            </motion.div>
          ) : (
            <motion.div key="done" className="q-result" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <motion.div className="result-stamp stamp-ink" initial={{ scale: 2, rotate: -25, opacity: 0 }} animate={{ scale: 1, rotate: -8, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 420, damping: 15 }} onAnimationStart={() => sfx.stamp()}>
                <small>SECURITY CHECK</small>
                {firstTry.current}/{z.questions.length} CLEARED
              </motion.div>
              <p className="result-line">{firstTry.current === z.questions.length ? z.perfect : z.pass}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="bottom">
        {done && <motion.button className="btn btn-primary" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} onClick={next}>{z.cta}</motion.button>}
      </div>
    </div>
  )
}
