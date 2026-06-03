# Card Addition Guide

## File Structure

```
webapp/
  assets/cards/        ← image files (BS01-001.jpg, BSC22-001.jpg, ...)
  src/data/
    cards.js           ← index: import all sets → export CARD_POOL
    sets/
      bs01.js          ← Eternal BS01
      rbs01.js         ← Standard RBS01
      rsd01.js … rsd06.js
      rp26.js
```

---

## JS Card Object Structure

```js
bs01001Goradon: {
  id:         "bs01001Goradon",       // setCode + 3-digit number + CamelCaseName
  format:     "Eternal",              // "Standard" | "Eternal"
  set:        "bs01",                 // set code (matches filename)
  name:       "Goradon",              // English name (no suffix for original)
  jpName:     "ゴラドン",              // from wiki Kanji row
  rarity:     "Common",               // Common | Uncommon | Rare | Master Rare
  type:       "spirit",               // spirit | magic | nexus | brave
  color:      "red",                  // red | purple | green | white | yellow | blue
  cost:       0,                      // from Cost row
  reduction:  0,                      // count of cost-reduction symbols (see below)
  symbols:    1,                      // count of soul-core symbols on card
  exsymbols:  false,                  // true if card has EX symbol (yellow star)
  bp:         1000,                   // Level 1 BP (for display)
  image:      "./assets/cards/BS01-001.jpg",
  family:     ["Reptile Beast"],      // array of family strings
  levels: [
    { level: 1, cores: 1, bp: 1000 },
    { level: 2, cores: 3, bp: 3000 },
    // { level: 3, cores: X, bp: Y, trueRelease: true }  ← add if True Release
  ],
  effects: [
    { condition: "[LV1-2] When Summoned", text: "Effect text here." },
  ],
},
```

### Revival variant — append `Revival` to ID and name

```js
bs01001GoradonRevival: {
  id:    "bs01001GoradonRevival",
  name:  "Goradon (Revival)",
  image: "./assets/cards/BSC22-001.jpg",   // revival set image
  // ... same structure, updated BP values
},
```

---

## Parsing the Wiki DOM

Paste the card page HTML (the `<div id="cftable">` block) and map fields:

| JS Field | DOM Location |
|---|---|
| `name` | `#header` text before `<br>` |
| `jpName` | `#header` text after `<br>` |
| `type` | `<b>Card Type</b>` row → text (Spirit → `"spirit"`) |
| `color` | `<b>Color</b>` row → first word lowercase |
| `cost` | `<b>Cost</b>` row → number |
| `reduction` | `<b>Reductions</b>` row → count core icon `<img>` tags (`-` = 0) |
| `symbols` | `<b>Symbols</b>` row → count core icon `<img>` tags |
| `exsymbols` | `<b>Symbols</b>` row → true if yellow star icon present |
| `family` | `<b>Families</b>` row → split by `,` into array |
| `levels` | `<b>Levels</b>` row → parse `Level N: X core, Y BP` per `<br>` |
| `rarity` | Sets section → text in parentheses after set name |
| `effects` | Effect table rows → `condition` = bold header, `text` = body |
| image URL | `<img>` at top → `src` attribute → strip `scale-to-width-down/300?` part |

### Image URL cleanup

Wiki img src:
```
https://static.wikia.nocookie.net/battle-spirits/images/6/67/BS01-001.jpg/revision/latest/scale-to-width-down/300?cb=...
```
Full resolution URL:
```
https://static.wikia.nocookie.net/battle-spirits/images/6/67/BS01-001.jpg/revision/latest?cb=...
```
Remove `/scale-to-width-down/300` before `?cb=`.

---

## ID Naming Rules

| Card Name | ID Suffix |
|---|---|
| `Goradon` | `Goradon` |
| `The Scout Dragno` | `TheScoutDragno` |
| `Volc-Baboon` | `VolcBaboon` |
| `Grip-Hands` | `GripHands` |
| `The FlameDragon Ma-Gwo` | `TheFlameDragonMaGwo` |

Rules:
- CamelCase each word
- Remove hyphens (capitalize next letter)
- Keep leading `The`

Full ID = `{setCode}{padded 3-digit number}{suffix}`
Example: `bs01014TheShamanDragno`

---

## Adding a New Card — Step by Step

1. **Find the card** on the wiki (e.g. https://battle-spirits.fandom.com/wiki/BS01)
2. **Paste the `<div id="cftable">` HTML** into the chat
3. **Image** is downloaded to `webapp/assets/cards/{SET}-{NNN}.jpg` automatically
4. **Add the entry** to the correct set file (`sets/bs01.js`, `sets/rsd01.js`, etc.)
5. If the card has a **Revival** version, add a second entry with `Revival` suffix

## Adding a New Set File

1. Create `webapp/src/data/sets/{setCode}.js`
2. Export `const CARDS_{SETCODE_UPPER} = { ... }`
3. In `cards.js`: add `import { CARDS_{SETCODE_UPPER} } from "./sets/{setCode}.js";` and spread into `CARD_POOL`
4. In `app.js` `SET_LABELS`: add `{setCode}: "Display Name"`

---

## Color → CSS Class

| color value | display |
|---|---|
| `"red"` | Red |
| `"purple"` | Purple |
| `"green"` | Green |
| `"white"` | White |
| `"yellow"` | Yellow |
| `"blue"` | Blue |

## Type Values

| wiki text | js value |
|---|---|
| Spirit | `"spirit"` |
| Magic | `"magic"` |
| Nexus | `"nexus"` |
| Brave | `"brave"` |
