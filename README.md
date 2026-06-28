# Wedding Invite — Themeable

A mobile-first, animated wedding invitation with GSAP + ScrollTrigger. Everything you'll normally change lives in **`config.js`**.

## Edit content (config.js)

Open `config.js` and change:

- **Names**: `names.one`, `names.two`, `names.monogram`
- **Date**: `date` (ISO, drives the countdown) and `display.pretty` (shown on page)
- **Address**: `address.venue`, `address.line`, `address.query` (used by the map + directions)
- **Ceremony / reception**: `ceremony`, `reception`
- **Quote**: `quote`
- **RSVP deadline**: `rsvpDeadline`

## Switch theme

In `config.js` set:

```js
THEME: 'blue'   // 'blue' | 'red' | 'white'
```

| Theme | Palette        | Decorative asset |
|-------|----------------|------------------|
| blue  | sky tones      | clouds (PNG)     |
| red   | warm rose/red  | flowers (CSS)    |
| white | minimal/mono   | SVG line art     |

All palettes are defined in `themes.css`. To tweak a color, edit the CSS variables under the matching `body[data-theme='...']` block.

## Dress code

Per-theme in `config.js` under `dressCode`:

```js
dressCode: {
  blue:  { label: 'Coastal Formal', colors: ['#1f6fb2', '#a9d8f5', '#d8b15a', '#f3f8fd'] },
  ...
}
```

The active theme's `label` and `colors` (shown as swatches) render automatically.

## Map

The map uses a keyless Google Maps embed built from `address.query`. No API key needed. “Get directions” opens Google Maps with the destination prefilled.

## RSVP → Google Sheet

1. Create a Google Sheet with headers: `timestamp, name, email, attending, guests, message`.
2. Extensions → Apps Script, paste:

```js
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const d = e.parameter;
  sheet.appendRow([new Date(), d.name, d.email, d.attending, d.guests, d.message]);
  return ContentService.createTextOutput('ok');
}
```

3. Deploy → New deployment → Web app → Execute as **Me**, access **Anyone** → copy the `/exec` URL.
4. Paste that URL into `config.js` as `rsvpEndpoint`. Leave empty for demo mode (stores locally).

## Deploy

Push to the default branch; the `pages` job in `.gitlab-ci.yml` publishes the site.
