// Draws the claimed ticket as a 1080×1920 story-sized image, then opens the
// share sheet on phones (save to photos / post) or downloads it on desktop.
export async function drawTicket(c, when) {
  await document.fonts.ready
  const t = c.ticket
  const W = 1080, H = 1920
  const cv = document.createElement('canvas')
  cv.width = W; cv.height = H
  const g = cv.getContext('2d')

  g.fillStyle = '#FFF7EC'; g.fillRect(0, 0, W, H)
  // soft confetti dots
  const dots = ['#F2477E', '#FFD873', '#A8D5F5', '#BFE8CF', '#DCCDF7']
  for (let i = 0; i < 70; i++) {
    g.fillStyle = dots[i % dots.length]
    g.globalAlpha = 0.55
    g.beginPath(); g.arc((i * 397) % W, (i * 613) % H, 6 + (i % 4) * 3, 0, Math.PI * 2); g.fill()
  }
  g.globalAlpha = 1

  g.fillStyle = '#2D2235'; g.textAlign = 'center'
  g.font = '600 92px Fredoka'; g.fillText(t.claimedTitle.replace(' 🫶', ''), W / 2, 260)
  g.fillStyle = '#9A6240'; g.font = '600 56px Caveat'; g.fillText(`${c.receiver} × ${c.sender}`, W / 2, 340)

  const x = 130, y = 420, w = W - 260, h = 1220
  const rr = (X, Y, Wd, Hd, r) => { g.beginPath(); g.roundRect(X, Y, Wd, Hd, r) }
  g.save(); g.shadowColor = 'rgba(122,74,46,.35)'; g.shadowBlur = 60; g.shadowOffsetY = 30
  g.fillStyle = '#fff'; rr(x, y, w, h, 44); g.fill(); g.restore()
  g.save(); rr(x, y, w, 120, [44, 44, 0, 0]); g.clip(); g.fillStyle = '#D92D68'; g.fillRect(x, y, w, 120); g.restore()
  g.fillStyle = '#fff'; g.textAlign = 'left'; g.font = '700 38px "Space Mono"'; g.fillText(t.band.split('').join(' '), x + 50, y + 76)

  g.fillStyle = '#2D2235'; g.font = '600 76px Fredoka'
  wrap(g, `${t.event} ${t.eventEmoji}`, x + 50, y + 220, w - 100, 86)
  const rows = [['WHO', t.who], ['WHERE', t.where], ['WHEN', when], ['RULES', t.rules]]
  let ry = y + 420
  for (const [k, v] of rows) {
    g.fillStyle = '#6B5A72'; g.font = '700 26px "Space Mono"'; g.fillText(k, x + 50, ry)
    g.fillStyle = '#2D2235'; g.font = '700 44px Nunito'; ry = wrap(g, v, x + 50, ry + 56, w - 100, 54) + 70
  }
  // perforation
  const py = y + h - 190
  g.strokeStyle = '#F6E7D3'; g.lineWidth = 6; g.setLineDash([18, 14])
  g.beginPath(); g.moveTo(x + 40, py); g.lineTo(x + w - 40, py); g.stroke(); g.setLineDash([])
  g.fillStyle = '#FFF7EC'
  g.beginPath(); g.arc(x, py, 34, 0, Math.PI * 2); g.fill()
  g.beginPath(); g.arc(x + w, py, 34, 0, Math.PI * 2); g.fill()
  // barcode
  g.fillStyle = '#2D2235'
  for (let i = 0, bx = x + 50; bx < x + 420; i++) { const bw = [4, 2, 6, 3][i % 4]; g.fillRect(bx, py + 50, bw, 90); bx += bw + [5, 3, 4, 6][i % 4] }
  g.textAlign = 'right'; g.fillStyle = '#6B5A72'; g.font = '700 30px "Space Mono"'
  g.fillText(t.number, x + w - 50, py + 90); g.fillText('VALID FOREVER', x + w - 50, py + 132)
  // claimed stamp
  g.save(); g.translate(x + w - 210, y + 735); g.rotate(-0.2)
  g.strokeStyle = '#237A4B'; g.lineWidth = 9; g.fillStyle = 'rgba(191,232,207,.35)'
  rr(-170, -55, 340, 110, 22); g.fill(); g.stroke()
  g.fillStyle = '#237A4B'; g.textAlign = 'center'; g.font = '700 50px "Space Mono"'; g.fillText('CLAIMED ✓', 0, 18)
  g.restore()

  g.textAlign = 'center'; g.fillStyle = '#9A6240'; g.font = '600 52px Caveat'
  g.fillText('see you there. no cancelling.', W / 2, 1760)
  g.fillStyle = '#6B5A72'; g.font = '700 30px Nunito'; g.fillText('made with KoiKoi 💕', W / 2, 1850)

  return cv
}

export async function saveTicket(c, when) {
  const t = c.ticket
  const cv = await drawTicket(c, when)
  const blob = await new Promise((r) => cv.toBlob(r, 'image/png'))
  const file = new File([blob], `${c.receiver}-${c.sender}-ticket.png`.toLowerCase(), { type: 'image/png' })
  if (navigator.canShare?.({ files: [file] })) {
    try { await navigator.share({ files: [file], title: t.event }); return } catch { /* cancelled → fall back */ }
  }
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob); a.download = file.name; a.click()
  setTimeout(() => URL.revokeObjectURL(a.href), 2000)
}

function wrap(g, text, x, y, maxW, lh) {
  const words = String(text).split(' ')
  let line = ''
  for (const w of words) {
    const test = line ? `${line} ${w}` : w
    if (g.measureText(test).width > maxW && line) { g.fillText(line, x, y); line = w; y += lh } else line = test
  }
  g.fillText(line, x, y)
  return y
}
