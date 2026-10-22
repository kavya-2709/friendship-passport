import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { sfx } from '../sound.js'
import { saveTicket } from '../saveTicket.js'
import './ticket.css'

const CONFETTI = ['☕', '🍕', '✨', '💖', '🎟️', '✨', '☕', '💛', '🍕', '✨', '💖', '🎉']

export default function Ticket({ c, next, replay }) {
  const t = c.ticket
  const [phase, setPhase] = useState('printing') // printing → ready → claimed
  const [when, setWhen] = useState(null)
  const [nudge, setNudge] = useState(false)
  const chips = useAnimation()

  useEffect(() => {
    sfx.print()
    const id = setTimeout(() => setPhase('ready'), 1500)
    return () => clearTimeout(id)
  }, [])

  const tear = () => {
    if (phase !== 'ready') return
    if (!when) {
      setNudge(true)
      sfx.wrong()
      chips.start({ x: [0, -6, 6, -4, 4, 0], transition: { duration: 0.4 } })
      return
    }
    sfx.tear()
    setPhase('claimed')
    setTimeout(() => { sfx.stamp(); sfx.cheer() }, 450)
  }

  const waText = encodeURIComponent(t.message(when || ''))
  const waLink = `https://wa.me/${c.senderWhatsApp}?text=${waText}`

  return (
    <div className="scene ticket-scene">
      <AnimatePresence mode="wait">
        <motion.div key={phase === 'claimed' ? 'b' : 'a'} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
          <h1 className="h1">{phase === 'claimed' ? t.claimedTitle : t.title}</h1>
          <p className="sub">{phase === 'claimed' ? t.claimedSub : t.sub}</p>
        </motion.div>
      </AnimatePresence>

      <div className="printer">
        <div className="slot" />
        <div className="paper-path">
          <motion.div className="ticket" initial={{ y: '-105%' }} animate={{ y: 0 }} transition={{ duration: 1.4, ease: [0.3, 0.1, 0.3, 1] }}>
            <div className="tk-band"><span>{t.band}</span><span>🎟️</span></div>
            <div className="tk-body">
              <div className="tk-ev">{t.event} {t.eventEmoji}</div>
              <div className="tk-row"><span className="lbl">Who</span><span className="v">{t.who}</span></div>
              <div className="tk-row"><span className="lbl">Where</span><span className="v">{t.where}</span></div>
              <div className="tk-row">
                <span className="lbl">{phase === 'claimed' ? 'When' : 'When · you pick'}</span>
                {phase === 'claimed' ? (
                  <span className="v">{when}</span>
                ) : (
                  <motion.div className="chips" animate={chips}>
                    {t.when.map((w) => (
                      <button key={w} className={`chip ${when === w ? 'on' : ''}`} onClick={() => { setWhen(w); setNudge(false); sfx.pop() }}>{w}</button>
                    ))}
                  </motion.div>
                )}
              </div>
              <div className="tk-row"><span className="lbl">Rules</span><span className="v">{t.rules}</span></div>
            </div>
            <div className="perf">{phase !== 'claimed' && <span className="scis">✂️</span>}</div>
            <motion.div
              className="stub"
              drag={phase === 'ready' && when ? true : false}
              dragSnapToOrigin
              dragElastic={0.5}
              onDragEnd={(_, i) => { if (Math.hypot(i.offset.x, i.offset.y) > 50) tear() }}
              onClick={tear}
              animate={phase === 'claimed' ? { x: 26, y: 70, rotate: 9 } : { x: 0, y: 0, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 160, damping: 14 }}
              role="button"
              aria-label={`Ticket stub. ${when ? 'Tap to claim.' : 'Pick a time first.'}`}
            >
              <div className="barcode" />
              <div className="no">{t.number}<br />VALID FOREVER</div>
            </motion.div>
            {phase === 'claimed' && (
              <motion.div className="claimed stamp-ink" initial={{ scale: 2.2, opacity: 0, rotate: -30 }} animate={{ scale: 1, opacity: 0.92, rotate: -12 }}
                transition={{ delay: 0.45, type: 'spring', stiffness: 420, damping: 15 }}>CLAIMED ✓</motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {phase === 'claimed' && (
        <div className="confetti" aria-hidden="true">
          {CONFETTI.map((e, k) => (
            <motion.span key={k} initial={{ x: 0, y: 0, opacity: 1, scale: 0.6 }}
              animate={{ x: (k % 2 ? 1 : -1) * (40 + (k * 23) % 140), y: -140 - (k * 37) % 160, opacity: 0, scale: 1.2, rotate: (k % 3 - 1) * 80 }}
              transition={{ delay: 0.5, duration: 1.4, ease: 'easeOut' }}>{e}</motion.span>
          ))}
        </div>
      )}

      <div className="bottom">
        {phase === 'ready' && (
          <p className={`hint ${nudge ? 'nudge' : ''}`}>{when ? t.hint : t.pickFirst}</p>
        )}
        {phase === 'claimed' && (
          <motion.div className="after" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}>
            <a className="btn btn-primary" href={waLink} target="_blank" rel="noreferrer">{t.tell}</a>
            <button className="btn btn-soft" onClick={() => saveTicket(c, when)}>{t.save}</button>
            <div className="foot">
              <button onClick={replay}>{t.replay}</button>
              <span>{t.made}</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
