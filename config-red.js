/* =====================================================================
   EDIT EVERYTHING HERE — no need to touch index.html / script.js
   =====================================================================
   - Change names, date, address, dress code, RSVP target, and THEME.
   - To switch theme, set THEME to one of: 'blue', 'red', 'white'.
   ===================================================================== */

window.WEDDING_CONFIG = {

  /* ---- Pick the active theme ----
     'blue'  = sky + clouds
     'red'   = warm + flowers
     'white' = minimal + SVG line art
  */
  THEME: 'red',

  /* ---- Couple ---- */
  names: {
    one: 'Elena',
    two: 'James',
    monogram: 'E & J',          // shown in footer
  },

  /* ---- Date & time ---- */
  date: '2026-09-26T16:00:00',
  display: {
    pretty: '26 \u00b7 09 \u00b7 2026',
    eyebrow: 'Together with their families',
  },

  /* ---- Venue / Address (used for the map) ---- */
  address: {
    venue: 'Villa Serbelloni',
    line: 'Lake Como, Italy',
    query: 'Grand Hotel Villa Serbelloni, Bellagio, Lake Como, Italy',
  },

  /* ---- Ceremony & reception details ---- */
  ceremony:  { title: 'The Ceremony',  time: '4:00 in the afternoon', place: 'Chapel of the Rose<br>Lake Como, Italy' },
  reception: { title: 'The Reception', time: '6:30 in the evening',    place: 'Villa Serbelloni<br>Dinner, dancing &amp; celebration' },

  /* ---- Calendar event ("Add to calendar" .ics button) ---- */
  calendar: {
    title: 'Elena & James — Wedding',
    durationHours: 6,
    details: 'We would be honoured to have you celebrate with us.',
  },

  /* ---- Dress code (per theme; the active theme's palette is shown) ---- */
  dressCode: {
    blue:  { label: 'Coastal Formal', colors: ['#1f6fb2', '#a9d8f5', '#d8b15a', '#f3f8fd'] },
    red:   { label: 'Garden Romantic', colors: ['#a11d2e', '#e08aa0', '#caa15a', '#fff4f3'] },
    white: { label: 'Timeless Minimal', colors: ['#1a1a1a', '#b8b1a6', '#caa15a', '#ffffff'] },
  },

  /* ---- Quote shown in the reveal section ---- */
  quote: 'We invite you to share in the beginning of forever.',

  /* ---- Schedule for the day (timeline). Add/remove freely. ---- */
  schedule: [
    { time: '13:00', title: 'Welcome',   desc: 'Guests arrive & refreshments' },
    { time: '14:00', title: 'Lunch',     desc: 'A seated celebratory meal' },
    { time: '16:00', title: 'Ceremony',  desc: 'Exchange of vows' },
    { time: '18:00', title: 'First Dance',desc: 'The newlyweds open the floor' },
    { time: '20:00', title: 'Reception', desc: 'Dinner, toasts & dancing' },
  ],

  /* Marker that travels down the timeline. 'auto' picks per theme.
     Override: 'ring' | 'flower' | 'star' | 'bird' */
  timelineMarker: 'auto',

  /* ---- Audio: soft background track. Leave url '' to hide the toggle.
     Add your own track URL here later to enable the mute button. ---- */
  audio: {
    url: '',
  },

  /* ---- Envelope intro ("click to open") ---- */
  envelope: {
    enabled: true,
    note: 'Click to open',
  },

  /* ---- RSVP ----
     Point at a Google Apps Script web app bound to your Google Sheet.
     Leave '' to store replies locally (demo mode). */
  rsvpEndpoint: 'https://script.google.com/macros/s/AKfycbwh8gcVodt4uJkdnOP9yIFdfDZufkw0o4TcXPqfV3nHy_mT70UkhkPxnmgpwxNwYhJk/exec',
  rsvpDeadline: 'Kindly reply by the first of August.',

  /* ---- Guestbook: reads notes from the same Sheet (GET -> JSON).
     Leave '' to show demo notes. Usually the same /exec URL as rsvpEndpoint. */
  guestbookEndpoint: 'https://script.google.com/macros/s/AKfycbwh8gcVodt4uJkdnOP9yIFdfDZufkw0o4TcXPqfV3nHy_mT70UkhkPxnmgpwxNwYhJk/exec',
};
