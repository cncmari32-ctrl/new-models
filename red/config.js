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

  /* ---- Date & time ----
     date: ISO string used for the live countdown.
     display: how the date is shown on the page.
  */
  date: '2026-09-26T16:00:00',
  display: {
    pretty: '26 · 09 · 2026',
    eyebrow: 'Together with their families',
  },

  /* ---- Venue / Address (used for the map) ---- */
  address: {
    venue: 'Villa Serbelloni',
    line: 'Lake Como, Italy',
    // Full address used to build the Google Maps embed + directions link:
    query: 'Grand Hotel Villa Serbelloni, Bellagio, Lake Como, Italy',
  },

  /* ---- Ceremony & reception details ---- */
  ceremony:  { title: 'The Ceremony',  time: '4:00 in the afternoon', place: 'Chapel of the Rose<br>Lake Como, Italy' },
  reception: { title: 'The Reception', time: '6:30 in the evening',    place: 'Villa Serbelloni<br>Dinner, dancing &amp; celebration' },

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

  /* Marker that travels down the timeline.
     Auto-picks per theme, override here: 'ring' | 'flower' | 'star' | 'bird' */
  timelineMarker: 'auto',

  /* ---- RSVP ----
     Point this at a Google Apps Script web app bound to your Google Sheet.
     See README for the 6-line Apps Script to paste. Leave '' to just store
     replies locally (demo mode).
  */
  rsvpEndpoint: '',  // e.g. 'https://script.google.com/macros/s/AKfycb.../exec'
  rsvpDeadline: 'Kindly reply by the first of August.',
};
