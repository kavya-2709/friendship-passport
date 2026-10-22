// Every word the receiver sees lives here. The sender builder will produce
// this same shape; the demo is Kavya (Allahabad) → Kritika (home for Diwali).

export const card = {
  sender: 'Kavya',
  receiver: 'Kritika',
  // Empty number → wa.me opens the contact picker (safe for a public demo).
  senderWhatsApp: '',

  reminder: {
    who: 'kritika · 2h',
    location: 'Allahabad',
    photo: 'photos/naini-bridge.webp',
    photoAlt: "Kritika's story: the Naini Bridge in Allahabad at dusk",
    scribble: "WAIT. you're in Allahabad?!",
    scribble2: "and didn't tell me?? 😤",
    line: 'So obviously, I made you something.',
    cta: 'Open it →',
  },

  cover: {
    title: 'FRIENDSHIP PASSPORT',
    first: 'Kritika',
    second: 'Kavya',
    ring: 'KRITIKA · KAVYA · ALLAHABAD · EST. 2016 · ',
    serial: 'Nº 2016 — ∞',
    inside: 'This passport belongs to',
    hint: 'Tap or swipe to open',
  },

  id: {
    number: 'Nº 2016',
    fields: [
      { label: 'Name', value: 'Kritika' },
      { label: 'Also known as', value: 'Kittu, Kriti' },
      { label: 'Occupation', value: 'Professional overthinker' },
      { label: 'Known weakness', value: 'Golgappe. Also golgappe.' },
    ],
    valid: 'FOREVER',
    seal: 'CERTIFIED BESTIE · SINCE 2016',
    hint: 'tilt me ✨',
    hintDrag: 'rub the photo ✨',
    after: "accurate? don't answer. it's accurate.",
  },

  journey: {
    title: 'How we got here',
    hint: 'scroll to travel ↓',
    stops: [
      { year: '2016', place: 'CLASS 9-B', ink: 'blue', img: 'photos/mem-2016-satchel.webp', alt: 'Sketch of a school satchel', line: 'where it started. you took my seat, I took your lunch.' },
      { year: '2019', place: 'CIVIL LINES', ink: 'pink', img: 'photos/mem-2019-pizza.webp', alt: 'Two slices of pizza on a plate', line: 'friday pizza. every. single. friday.' },
      { year: '2022', place: 'RISHIKESH', ink: 'purple', img: 'photos/mem-2022-rishikesh.webp', alt: 'A cow resting on Laxman Jhula bridge, Rishikesh', line: "the trip mummy almost didn't allow." },
      { year: '2024', place: 'FAREWELL', ink: 'green', img: 'photos/mem-2024-caps.webp', alt: 'Graduation caps thrown in the air', line: '"we\'ll meet every month." 😅' },
    ],
    split: 'then life happened.',
    days: 247,
    km: '1,456',
    cityThem: 'BENGALURU',
    cityYou: 'ALLAHABAD',
    next: 'next stop?',
    credits: 'Photos: Wikimedia Commons — D. Ring (CC0), D. Perkins (CC0), Dey.sandip (CC BY-SA 4.0), AKS.9955 (CC BY-SA 4.0)',
    cta: 'Next →',
  },

  visas: {
    title: 'Only-us visas',
    hint: 'peel ↗',
    items: [
      { type: 'BLACK KURTI CUSTODY', detail: 'status: disputed (since 2021)', color: 'lilac' },
      { type: '"BAS 5 MIN, READY HO RAHI"', detail: 'actual time: 45 min. every time.', color: 'butter' },
      { type: 'GOSSIP CLEARANCE', detail: 'top secret. never expires.', color: 'mint' },
    ],
    done: 'all visas valid. all still active. just saying.',
    cta: 'Next →',
  },

  quiz: {
    title: 'Do you still remember?',
    questions: [
      { q: 'Who screamed before the rafting even started in Rishikesh?', options: ['You', 'Me', 'Both of us, loudly'], answer: 2 },
      { q: 'What do I order at every café?', options: ['Cold coffee', 'Cutting chai', '"Whatever you\'re having"'], answer: 2 },
      { q: '"bas 5 min, ready ho rahi" in my time means…', options: ['5 min', '15 min', '45 min'], answer: 2 },
    ],
    right: ['okay you DO remember 🥹', "correct. I'm emotional.", 'obviously. ✨'],
    wrong: ['excuse me?? 🤨 try again', 'wow. okay. try again.'],
    perfect: 'still my person. ✅',
    pass: 'passing you anyway. 😤',
    cta: 'Next →',
  },

  note: {
    hint: 'pull it out ↑',
    lines: [
      'Kritika,',
      'I saw your story and literally screamed "KRITIKA?!" in the middle of dinner. Mummy asked if I was okay. I was not.',
      'We never fought. Life just got busy, and "let\'s catch up soon" turned into 247 days.',
      'But every time something stupid happens, my first thought is still, I need to tell Kritika.',
      "So I'm telling you. I miss you. You're home for once, and I'm not letting this one go.",
    ],
    signoff: 'Kavya',
    cta: 'One more thing →',
  },

  ticket: {
    title: 'Next stop: us.',
    sub: 'already booked. you pick when.',
    band: 'ADMIT TWO',
    event: 'Chai & gossip, 5 PM',
    eventEmoji: '☕',
    who: 'Kritika + Kavya',
    where: 'Our spot, Civil Lines',
    when: ['Today, 5 PM', 'Tomorrow, 5 PM', 'Before you leave'],
    rules: 'Phones down. Loser pays for pizza.',
    number: 'Nº 2016-∞',
    pickFirst: 'pick a time first ↑',
    hint: 'tear to claim ✂️',
    claimedTitle: "It's a date. 🫶",
    claimedSub: 'no cancelling now.',
    tell: 'Tell Kavya 💬',
    save: 'Save ticket ⬇',
    message: (when) => `Ticket claimed 🎟️ Chai & gossip, ${when}. Pizza on you. ☕🍕`,
    replay: '↺ flip through again',
    made: 'Made with KoiKoi 💕',
  },
}
