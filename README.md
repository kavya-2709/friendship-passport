# Friendship Passport ✈️

An interactive, mobile-first friendship card built for the **KoiKoi (Inkpen Labs) Product Design Intern** assignment.

**Live:** https://kavya-2709.github.io/friendship-passport/

Something reminds you of a friend you drifted from, so you send them a passport of your friendship. It has a roast ID page, a trail of your memories, inside-joke visas and a quiz. It ends with a ticket to actually meet.

## The flow
1. **The reminder:** "WAIT. you're in Allahabad?!"
2. **The passport:** tap or drag to lift the cover
3. **Your ID:** rub the photo to reveal the hologram
4. **How we got here:** scroll the trail; it splits into two cities and comes back to "next stop?"
5. **Only-us visas:** peel the inside jokes
6. **Quick check:** a three-question quiz
7. **The note:** pull the letter out of the back pocket
8. **The ticket:** pick a time and tear the stub to claim it, then tell the sender on WhatsApp or save the ticket image

## Tech
Vite, React and Framer Motion. Sounds are synthesized with the Web Audio API, so there are no audio files. Add `?s=3` to the URL to jump straight to a scene.

```bash
npm install
npm run dev
```

## Photo credits
- The Naini Bridge photo was provided by the author.
- The memory photos are from Wikimedia Commons:
  - [School satchel](https://commons.wikimedia.org/wiki/File:School_satchel.tif): David Ring, CC0
  - [Two pizza slices](https://commons.wikimedia.org/wiki/File:Two_pizza_slices.jpg): Douglas Perkins, CC0
  - [Laxman Jhula Bridge](https://commons.wikimedia.org/wiki/File:Laxman_Jhula_Bridge.jpg): Dey.sandip, CC BY-SA 4.0
  - [Square academic cap](https://commons.wikimedia.org/wiki/File:Square_academic_cap_(graduation_hats).JPG): AKS.9955, CC BY-SA 4.0
