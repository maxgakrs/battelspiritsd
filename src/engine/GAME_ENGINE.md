# BattleSpirit SD — Game Engine Reference

> **วิธีใช้:** อ่านไฟล์นี้ก่อนแก้ `game.js` เพื่อรู้ว่าต้องแก้ตรงไหน  
> **อัพเดท:** เมื่อเพิ่ม effect ใหม่ ขยาย hook หรือเปลี่ยน state ใดๆ ให้แก้ไฟล์นี้ด้วย

---

## สารบัญ

1. [โครงสร้างไฟล์](#1-โครงสร้างไฟล์)
2. [Phase ของเกม](#2-phase-ของเกม)
3. [State ของ Game class](#3-state-ของ-game-class)
4. [State ของ Player / Spirit / Nexus](#4-state-ของ-player--spirit--nexus)
5. [Helper Functions](#5-helper-functions)
6. [Effect Handler Tables](#6-effect-handler-tables)
   - [CARD_EFFECTS — Hooks](#card_effects--hooks)
   - [MAGIC_EFFECTS — Main Step Magic](#magic_effects--main-step-magic)
   - [MAGIC_FLASH_EFFECTS — Flash Magic](#magic_flash_effects--flash-magic)
   - [INVOKE_FLASH_HANDLERS — Spirit Invoke Flash](#invoke_flash_handlers--spirit-invoke-flash)
   - [NEXUS_FLASH_HANDLERS — Nexus Invoke Flash](#nexus_flash_handlers--nexus-invoke-flash)
   - [INVOKE_MAIN_HANDLERS — Spirit Invoke Main](#invoke_main_handlers--spirit-invoke-main)
   - [NEXUS_INVOKE_MAIN_HANDLERS — Nexus Invoke Main](#nexus_invoke_main_handlers--nexus-invoke-main)
   - [BLOCK_INVOKE_FLASH_HANDLERS — Block Invoke Flash](#block_invoke_flash_handlers--block-invoke-flash)
7. [BattleSpiritGame — Public Methods](#7-battlespiritgame--public-methods)
8. [BattleSpiritGame — Private Helpers](#8-battlespiritgame--private-helpers)
9. [awaitingEffect Types](#9-awaitingeffect-types)
10. [Runtime Flags (Temporary)](#10-runtime-flags-temporary)
11. [Core / Payment System](#11-core--payment-system)
12. [Level / True Release System](#12-level--true-release-system)
13. [Soul Magic](#13-soul-magic)
14. [Flash Window Flow](#14-flash-window-flow)
15. [การเพิ่ม Card Effect ใหม่](#15-การเพิ่ม-card-effect-ใหม่)

---

## 1. โครงสร้างไฟล์

```
game.js (≈4800 บรรทัด)
│
├── [~1–88]      Imports, PHASES, shuffle(), Level helpers, BP helpers
├── [~88–2167]   CARD_EFFECTS  — spirit & nexus permanent effects
├── [~2171–2244] MAGIC_EFFECTS — main-step magic effects
├── [~2246–2663] MAGIC_FLASH_EFFECTS — flash magic effects (incl. Soul Magic RSD)
├── [~2895–3202] INVOKE_FLASH_HANDLERS — spirit "Invoke: Flash" effects
├── [~3204–3254] NEXUS_FLASH_HANDLERS — nexus "Invoke: Flash" effects
├── [~3258–3319] INVOKE_MAIN_HANDLERS — spirit "Invoke Main" effects
├── [~3323–3366] NEXUS_INVOKE_MAIN_HANDLERS — nexus "Invoke Main" effects
├── [~3370–3397] BLOCK_INVOKE_FLASH_HANDLERS — "Invoke Flash" during block
├── [~3402–3544] Factory functions + utility math functions
└── [~3548–4794] BattleSpiritGame class
```

---

## 2. Phase ของเกม

```js
PHASES = { MAIN: "MAIN", ATTACK: "ATTACK", MAIN2: "MAIN2" }
PHASE_ORDER = [MAIN, ATTACK, MAIN2]
```

หนึ่ง Turn ของผู้เล่นแต่ละคน ไล่ตาม `phaseIndex`:

| phaseIndex | Phase  | ทำอะไรได้                              |
|------------|--------|-----------------------------------------|
| 0          | MAIN   | Summon, Deploy, Move Cores, Play Magic  |
| 1          | ATTACK | Declare attackers → Flash → Block → Battle |
| 2          | MAIN2  | Summon, Deploy, Move Cores, Play Magic  |

เมื่อ MAIN2 จบ → `endTurn()` → สลับ `currentPlayer` → `startTurn()` ของอีกฝ่าย

---

## 3. State ของ Game class

```js
this.players[0]            // Player (human)
this.players[1]            // AI
this.currentPlayer         // 0 หรือ 1 — ใครเป็นคน Active
this.turnNumber            // เริ่มต้นที่ 0
this.phaseIndex            // index ใน PHASE_ORDER
this.log                   // string[] — ข้อความ battle log
this.winner                // null | 0 | 1
this.awaitingBlock         // { attackerUid, defenderId } | null
this.awaitingEffect        // { type, ownerId, validTargets, ... } | null
this.awaitingFlash         // { attackerUid } | null
this._lifeReducedThisTurn  // boolean — reset ทุก turn
this._pendingAiBlockChooser // callback ที่ AI ใช้เลือก blocker
```

### awaitingBlock
เซ็ตเมื่อมีการ Attack และกำลังรอ Human เลือก Block  
`{ attackerUid: string, defenderId: number }`

### awaitingEffect
เซ็ตเมื่อ effect ต้องการ Human เลือก target  
ดู [Section 9](#9-awaitingeffect-types) สำหรับ type ทั้งหมด

### awaitingFlash
เซ็ตเมื่อ Flash Window เปิดอยู่ (ก่อน battle resolve)  
`{ attackerUid: string }`

---

## 4. State ของ Player / Spirit / Nexus

### Player Object
สร้างจาก `makePlayer(id, deckId, isAi)`:

```js
{
  id: 0 | 1,
  name: "You" | "AI",
  isAi: boolean,
  deckId: string,
  deck: string[],        // card IDs ที่ยังอยู่ใน deck
  hand: string[],        // card IDs ที่อยู่ใน hand
  spirits: Spirit[],
  nexuses: Nexus[],
  trash: string[],       // card IDs ที่ถูก discard
  banished: string[],    // card IDs ที่ถูก banish
  reserve: { normal: number, soul: boolean },
  trashCore: { normal: number, soul: boolean },
  life: number,          // เริ่มต้น 5
  // Flags (reset ต่าง turn)
  _depletedOpponentThisTurn?: boolean,
  _usedTopazMagicThisTurn?: boolean,
  _usedThunderDragonMagicThisTurn?: boolean,
}
```

### Spirit Object
สร้างจาก `makeSpiritFromCard(cardId, ownerId, turnNumber, initialCores=1)`:

```js
{
  uid: string,           // unique random ID เช่น "rsd01001-ab12cd"
  cardId: string,
  ownerId: 0 | 1,
  name: string,
  color: string,
  symbols: number,
  bp: number,            // base BP จาก card data
  bpBoost: number,       // temporary BP modifier (reset ต่อ turn)
  exhausted: boolean,
  cores: { normal: number, soul: boolean },
  summonedTurn: number,
  // Runtime flags — ดู Section 10
}
```

### Nexus Object
สร้างจาก `makeNexusFromCard(cardId, ownerId, turnNumber)`:

```js
{
  uid: string,
  cardId: string,
  ownerId: 0 | 1,
  name: string,
  color: string,
  symbols: number,       // ใช้นับ cost reduction
  exhausted: boolean,
  cores: { normal: number, soul: boolean },
  deployedTurn: number,
}
```

---

## 5. Helper Functions

| Function | ใช้ทำอะไร |
|---|---|
| `getCardLevel(spirit, card)` | คืน level ปัจจุบันของ spirit/nexus จาก cores |
| `getEffectiveBP(spirit, card)` | คืน BP จริง (รวม bpBoost) |
| `countSymbols(player, color)` | นับ symbols สีนั้นๆ บน field (spirits + nexuses) |
| `passiveSymbolBonus(player, card)` | symbols เพิ่มเติมจาก passive effects ตอน summon |
| `totalFieldCores(player)` | นับ cores ทั้งหมดบน field (reserve + spirits + nexuses) |
| `totalReserve(player)` | นับ cores ใน reserve เท่านั้น |
| `_specTotal(spec)` | นับ cores ทั้งหมดใน paySpec |
| `_applyPaySpec(player, spec)` | หัก cores ออกจาก zones ตาม spec |
| `_applyPlaceSpec(player, spirit, spec)` | ย้าย cores จาก zones ไปวางบน spirit |
| `meetsLevelReq(entry, total, hasSoul)` | ตรวจว่า spirit/nexus ถึง level นี้ไหม |

### Family / Keyword Checkers
```js
isWindfang(id), isArmoredFish(id), isMineroid(id), isThunderDragon(id),
isFerobeast(id), isBloodrouse(id), isRedCloud(id), isDarkPuce(id),
isOceanicGreen(id), isLeucomyst(id), isTopaz(id), isCyantree(id),
isEchochant(id)

hasClash(id), hasShamanism(id), hasRumble(id), hasAmplify(id), hasCurrent(id)
getRumbleN(spirit)   // อ่านค่า N จาก keyword "Rumble: N"
```

---

## 6. Effect Handler Tables

### CARD_EFFECTS — Hooks

ทุก spirit/nexus card สามารถมี handlers เหล่านี้ใน `CARD_EFFECTS[cardId]`:

| Hook | เรียกเมื่อ | Parameters |
|---|---|---|
| `onSummon` | spirit ถูก summon | `(game, spirit, player)` |
| `onAttack` | spirit ประกาศ attack | `(game, spirit, player, level, attackerUid)` |
| `onBlock` | spirit เลือก block | `(game, spirit, player, level)` |
| `onBlockWin` | blocker ชนะ battle | `(game, spirit, player, level)` |
| `onAttackWin` | attacker ชนะ battle | `(game, spirit, player, level)` |
| `onDestroy` | spirit ถูก destroy | `(game, spirit, player)` |
| `onEndStep` | จบ phase ปัจจุบัน | `(game, spirit, player, level)` |
| `onStartAttackStep` | เริ่ม Attack Step (ฝ่ายตัวเอง) | `(game, spirit, player, level)` |
| `onStartOpposingAttackStep` | เริ่ม Attack Step ของฝ่ายตรงข้าม | `(game, spirit, player, level)` |
| `onMagicPlay` | magic card ถูกเล่น | `(game, spirit, player, level, magicCardId)` |
| `onDrawStep` | nexus เมื่อถึง Draw Step ของ turn | `(game, nexus, player, level)` |
| `onDeploy` | nexus ถูก deploy | `(game, nexus, player)` |
| `onNexusSummon` | spirit ถูก summon ขณะมี nexus นี้บน field | `(game, nexus, player, newSpirit)` |
| `onNexusDestroyed` | nexus นี้ถูก destroy | `(game, nexus, player)` |
| `onNexusMagicPlay` | magic ถูกเล่นขณะมี nexus นี้ | `(game, nexus, player, level, magicCardId)` |
| `onSpiritAttack` | spirit attack ขณะมี nexus นี้ | `(game, nexus, player, attacker)` |
| `onAtkLifeReduced` | attacker ลด life ฝ่ายตรงข้าม | `(game, nexus, player, attacker, level)` |
| `onOwnLifeReduced` | life ตัวเองถูกลด | `(game, nexus, player, level)` |

> **ตัวอย่างเพิ่ม effect ใหม่:**
> ```js
> CARD_EFFECTS["rsd01001Mushakko"] = {
>   onAttack(_game, spirit, _player, level) {
>     if (level < 2) return;
>     spirit._drawOnBattleEnd = true;
>   },
> };
> ```

---

### MAGIC_EFFECTS — Main Step Magic

```js
MAGIC_EFFECTS["cardId"] = {
  getMainTargets(game, player) { return [{ uid, label }]; },
  main(game, player, targetUid) { /* execute effect */ },
};
```

- `getMainTargets` คืน `[]` ถ้าไม่ต้องการ target (effect ทำทันที)
- เรียกจาก `playMagic(handIndex, targetUid=null, useFlash=false)`

---

### MAGIC_FLASH_EFFECTS — Flash Magic

```js
MAGIC_FLASH_EFFECTS["cardId"] = {
  getFlashTargets(game, player) { return [{ uid, label }]; },
  flash(game, player, targetUid) { /* execute effect */ },
};
```

- เรียกจาก `playFlashMagic(handIndex, targetUid=null, paySpec=null)`
- Soul Magic cards อยู่ที่นี่ด้วย (`rsd02014SoulBite`, `rsd03014TentacleAttack`, etc.)

**Soul Magic cards ที่มี (ดู Section 13 สำหรับ mechanic):**

| Card ID | Color | Flash Effect |
|---|---|---|
| `rsd01014FlameHurricane` | Red | Destroy ≤7000 BP (≤10000 ถ้า life ลดแล้ว) |
| `rsd02014SoulBite` | Purple | Send 2 cores จาก opp spirit → Reserve |
| `rsd03014TentacleAttack` | Green | Heavy exhaust opp spirit |
| `rsd04014DefensiveGate` | White | Opp spirit ห้ามลด life; +2 spirits ถ้า life ลดแล้ว |
| `rsd05014TripleThunder` | Yellow | -2000 BP ×3 แล้ว destroy ถ้า 0 BP |
| `rsd06013StemLance` | Blue | Destroy opp Cost≤4 spirit |
| `rbs01111VermillionRoar` | Red | Own Clash spirit +3000 BP |
| `rbs01113Awakening` | Purple | Summon Purple spirit (no effects) from Trash |
| `rbs01116DoubleVortex` | Green | Exhaust 2 opp Cost≤4 spirits |
| `rbs01120PunishGate` | White | Return ≤7000 BP to hand (deckbottom ถ้า life ลดแล้ว) |
| `rbs01122BoltGrid` | Yellow | Opp Cost≤4 spirit can't attack/block |
| `rbs01124FindTreasure` | Blue | Own spirit +2000 BP |

---

### INVOKE_FLASH_HANDLERS — Spirit Invoke Flash

```js
INVOKE_FLASH_HANDLERS["cardId"] = {
  canInvoke(spirit, player, attackerUid) { return boolean; },
  invoke(game, spirit, player, attackerUid) { /* effect */ },
};
```

- เรียกจาก `canInvokeFlash(spiritUid)` / `invokeFlash(spiritUid)`
- มักใช้กับ spirit ที่มี effect: `[LVX] Invoke: Flash`
- **ต้องเช็ค `spirit.flashUsedThisBattle`** เพื่อป้องกัน double-use

**Magirrate Invoke Flash** — `rbs01072Thunderai` (LV2), `rbs01075Potariwa` (LV1+), `rbs01X15TheReturningThunderEmbalmimer` (LV1+)  
ทั้งสามใช้ `_magirrateInvoke()` helper: เลือก Topaz Magic ใน hand แล้ว execute flash effect ฟรี (ไม่จ่าย cost)  
- AI: auto-execute card แรก  
- Human: `awaitingEffect: magirrateMagic` → เลือก card → ถ้ามี target: `magirrateMagicTarget` → execute

---

### NEXUS_FLASH_HANDLERS — Nexus Invoke Flash

```js
NEXUS_FLASH_HANDLERS["cardId"] = {
  canInvoke(nexus, player, attackerUid) { return boolean; },
  invoke(game, nexus, player, attackerUid) { /* effect */ },
};
```

- เรียกจาก `canInvokeNexusFlash(nexusUid)` / `invokeNexusFlash(nexusUid)`
- มักเช็ค `nexus.exhausted` และ family ของ attacker

**Cards ที่มี:**
- `rsd01010UtmostDepthTheWindfangCrag` — Windfang attacker +2000 BP
- `rbs01098TheCurrentCorridor` — Current attacker +2000 BP
- `rsd02009UtmostDepthBloodrouseMountainRange` — Bloodrouse attacker +2000 BP
- `rbs01093TheDowndraftDragonCurrent` — [LV2] Clash attacker +3000 BP this battle

---

### INVOKE_MAIN_HANDLERS — Spirit Invoke Main

```js
INVOKE_MAIN_HANDLERS["cardId"] = {
  canInvoke(spirit, player) { return boolean; },
  invoke(game, spirit, player) { /* effect */ },
};
```

---

### NEXUS_INVOKE_MAIN_HANDLERS — Nexus Invoke Main

```js
NEXUS_INVOKE_MAIN_HANDLERS["cardId"] = {
  canInvoke(nexus, player) { return boolean; },
  invoke(game, nexus, player, targetUid) { /* effect */ },
};
```

---

### BLOCK_INVOKE_FLASH_HANDLERS — Block Invoke Flash

```js
BLOCK_INVOKE_FLASH_HANDLERS["cardId"] = {
  canBlockInvoke(spirit, player, level) { return boolean; },
  blockInvoke(game, spirit, player) { /* effect */ },
};
```

เรียกตอน defend (ก่อน resolve battle) โดย blocker

---

## 7. BattleSpiritGame — Public Methods

### Turn / Phase

| Method | ทำอะไร |
|---|---|
| `startTurn()` | เริ่ม turn ใหม่: refresh, draw, reset flags |
| `nextPhase()` | เดินหน้า phase ถัดไป (เรียก trigger hooks ด้วย) |
| `endTurn()` | จบ turn: cleanup → สลับ currentPlayer → startTurn |
| `getState()` | คืน snapshot ของ game state (deep clone) |

### Summoning

| Method | ทำอะไร |
|---|---|
| `canSummon(handIndex)` | เช็คว่า summon ได้ไหม, คืน `{ ok, actualCost, card, lv1Min, maxPlaceable }` |
| `summonWithSpecs(handIndex, paySpec, placeSpec, legacyBanishCount)` | Summon โดยระบุ payment zones และ placement zones |
| `summon(handIndex, { useSoulCore, coresToPlace })` | Summon แบบ auto (AI ใช้) |

### Nexus

| Method | ทำอะไร |
|---|---|
| `canDeploy(handIndex)` | เช็ค deploy |
| `deployNexus(handIndex)` | Deploy nexus |

### Magic

| Method | ทำอะไร |
|---|---|
| `canPlayMagic(handIndex)` | เช็ค main-step magic |
| `playMagic(handIndex, targetUid, useFlash, paySpec)` | เล่น magic (main หรือ main-step flash) |
| `canPlayFlashMagic(handIndex)` | เช็ค flash magic (ขณะ Flash Window) |
| `playFlashMagic(handIndex, targetUid, paySpec)` | เล่น flash magic |

### Core Movement

| Method | ทำอะไร |
|---|---|
| `canMoveCore(from, fromUid, to, toUid, isSoul)` | เช็ค move core |
| `moveCore(from, fromUid, to, toUid, isSoul)` | ย้าย core ระหว่าง zones |

`from` / `to` = `"reserve"` \| `"spirit"` \| `"nexus"`

### Attack / Battle

| Method | ทำอะไร |
|---|---|
| `canAttack(attackerUid)` | เช็ค attack |
| `declareAttack(attackerUid, aiBlockChooser)` | ประกาศ attack → เปิด Flash Window หรือ Block phase |
| `defendWith(blockerUidOrNull)` | Human เลือก blocker (null = ไม่ block) |
| `resolveBattle(attackerUid, blockerUid)` | Resolve การชน BP → ทำลาย spirits / ลด life |

### Flash Window

| Method | ทำอะไร |
|---|---|
| `passFlash()` | ผ่าน Flash Window → ไป block phase |
| `canInvokeFlash(spiritUid)` | เช็ค spirit Invoke Flash |
| `invokeFlash(spiritUid)` | ใช้ spirit Invoke Flash |
| `canInvokeNexusFlash(nexusUid)` | เช็ค nexus Invoke Flash |
| `invokeNexusFlash(nexusUid)` | ใช้ nexus Invoke Flash |
| `canFlashSummon(handIndex)` | เช็ค flash summon |
| `flashSummon(handIndex, { coresToPlace })` | Summon ในช่วง Flash Window |

### Invoke Main

| Method | ทำอะไร |
|---|---|
| `canInvokeNexusMain(nexusUid)` | เช็ค nexus Invoke Main |
| `invokeNexusMain(nexusUid, targetUid)` | ใช้ nexus Invoke Main |

### Effect Resolution

| Method | ทำอะไร |
|---|---|
| `resolveEffect(targetUid, aiBlockChooser)` | Resolve `awaitingEffect` ด้วย target ที่เลือก (`null` = skip) |

---

## 8. BattleSpiritGame — Private Helpers

| Method | ทำอะไร |
|---|---|
| `_opp(player)` | คืน player อีกฝ่าย |
| `_reduceLife(player, amount)` | ลด life + ส่ง core จาก trashCore ไป Reserve |
| `_bpDamage(opp, uid, amount)` | ลด BP spirit แล้ว destroy ถ้า ≤ 0 |
| `_sendCores(opp, uid, n)` | ส่ง n cores จาก spirit → opp Reserve; คืน `true` ถ้า depleted |
| `_drainToOne(opp, uid)` | เหลือ core เดียวบน spirit |
| `_returnToHand(opp, uid)` | คืน spirit → hand |
| `_returnToDeckBottom(opp, uid)` | คืน spirit → ก้น deck |
| `_destroyNexus(player, uid)` | ทำลาย nexus + คืน cores → Reserve |
| `_coreFromVoidToSpirit(player, uid)` | ดึง 1 core จาก trashCore → spirit |
| `_refreshSpirit(player, uid)` | refresh spirit (exhausted = false) |
| `_destroyOwnSpirit(player, uid)` | ทำลาย spirit ของตัวเอง |
| `_checkAndDestroyDepleted(player)` | ทำลาย spirits/nexuses ที่ cores ต่ำกว่า LV1 min |
| `autoMoveCoresToReserve(player, needed)` | ย้าย cores จาก field → Reserve ให้พอจ่าย |
| `payFromReserve(player, amount)` | หัก cores จาก Reserve ไป trashCore |
| `_hasAnyFlashAction()` | เช็คว่ายังมี Flash action ให้ทำไหม |
| `_proceedToBattle(attackerUid, aiBlockChooser)` | เดินหน้าสู่ block phase |
| `_triggerStartAttackStep()` | เรียก onStartAttackStep hooks |
| `_triggerStartOpposingAttackStep()` | เรียก onStartOpposingAttackStep hooks |
| `_triggerEndStep()` | เรียก onEndStep hooks |

---

## 9. awaitingEffect Types

เมื่อ effect ต้องการ Human เลือก target จะ set `game.awaitingEffect = { type, ownerId, validTargets, optional, ... }`  
UI เรียก `game.resolveEffect(targetUid)` เมื่อผู้เล่นเลือก (หรือ `null` เพื่อ skip ถ้า optional)

| type | ผู้รับ target | คืน UID จาก |
|---|---|---|
| `destroySpirit` | opp spirit | opp.spirits |
| `sendCoreFromSpirit` | opp spirit | opp.spirits |
| `sendCoreAndDrawIfDepleted` | opp spirit | opp.spirits |
| `drainToOne` | opp spirit | opp.spirits |
| `exhaustSpirit` | opp spirit | opp.spirits |
| `returnToHand` | opp spirit | opp.spirits |
| `returnToDeckBottom` | opp spirit | opp.spirits |
| `bpDamage2000` | opp spirit | opp.spirits |
| `bpDamage4000` | opp spirit | opp.spirits |
| `forceAttack` | opp spirit | opp.spirits |
| `destroyNexus` | opp nexus | opp.nexuses |
| `coreFromVoidToOwnSpirit` | own spirit | player.spirits |
| `refreshOwnSpirit` | own spirit | player.spirits |
| `destroyOwnSpirit` | own spirit | player.spirits |
| `exhaustOwnSpirit` | own spirit | player.spirits |
| `tombsPickPurple` | own spirit | player.spirits |
| `exhaustToBlock` | own spirit | player.spirits |
| `defensiveGateSecond` | opp spirit | opp.spirits |
| `summonFromTrash` | card ID | player.trash (card IDs) |
| `returnCardFromTrash` | card ID | player.trash (card IDs) |
| `summonFromReveal` | card ID | revealed cards |
| `deckReveal` | (special modal) | — |
| `selectMagicTarget` | opp spirit/nexus | opp.spirits + opp.nexuses |
| `selectMagicFlashTarget` | opp spirit/nexus | opp.spirits + opp.nexuses |
| `selectFlashTarget` | any spirit | all spirits |
| `coreFromTrashToOwnSpirit` | own spirit | player.spirits — ดึง core จาก trashCore.normal |
| `bpBoostOwnClashSpirit2000` | own Clash spirit | player.spirits (filter Clash) |
| `triggerSummonEffect` | own Topaz spirit | player.spirits (filter Topaz) |
| `returnHandCardToDeckBottom` | hand card | player.hand (index strings "0","1",...) |
| `magirrateMagic` | hand card | player.hand (index strings "0","1",...) — Topaz flash magic to use for free |
| `magirrateMagicTarget` | any spirit | all spirits — target for the chosen Topaz magic's flash |

### สำคัญ — `pendingBattleAttackerUid`
ถ้า awaitingEffect มี `pendingBattleAttackerUid` ที่ไม่ใช่ null → หลัง resolve จะกลับไปเปิด Flash Window หรือ proceed to battle อัตโนมัติ

---

## 10. Runtime Flags (Temporary)

Flags เหล่านี้ถูก set บน spirit/nexus object ชั่วคราว ไม่ได้อยู่ใน card data

### Spirit Flags

| Flag | เซ็ตโดย | ความหมาย |
|---|---|---|
| `_cantAttackThisTurn` | BoltGrid, DoubleVortex | ห้าม attack turn นี้ |
| `_cantBlockThisTurn` | BoltGrid | ห้าม block turn นี้ |
| `_cantAttackAtLV1` | บาง spirit card | ห้าม attack ถ้า LV1 |
| `_cantReduceLife` | DefensiveGate | attack ของ spirit นี้ไม่ลด life |
| `_heavyExhausted` | TentacleAttack, etc. | exhausted พิเศษ (ไม่ refresh ตามปกติ) |
| `_mustAttackFirst` | forceAttack | ต้อง attack ก่อนใน turn นั้น |
| `_destroyAfterBattle` | บาง spirit | ถูก destroy หลัง battle จบ |
| `_refreshAfterBattle` | บาง spirit | refresh หลัง battle จบ |
| `_drawOnBattleEnd` | Mushakko LV2 | draw เมื่อ battle จบ |
| `_drawOnLifeReduce` | บาง spirit | draw เมื่อ attack ลด life |
| `_drawTwoOnAttackWin` | บาง spirit | draw 2 เมื่อ attack ชนะ |
| `_cantBeBlockedBPLimit` | Palecoeurl | ถูก block ได้เฉพาะ blocker BP > X |
| `_cantBeBlockedCostLimit` | บาง spirit | ถูก block ได้เฉพาะ blocker Cost > X |
| `_magicImmune` | GuardEffect | ไม่สามารถถูก target ด้วย magic effects ใน battle นี้ |
| `_coreFloorOne` | TLVC LV2 | ใน `_sendCores` cores ไม่ลดต่ำกว่า 1 รวม |
| `_extraLifeReductionOnWin` | VermillionRoar | ลด life เพิ่มถ้า blocker ถูก destroy |
| `_forceExhaustedBlock` | MeteorCrash | บังคับ exhausted spirits block ได้ |
| `_requiresOpponentExhaustToBlock` | บาง spirit | opp ต้อง exhaust spirit เพื่อ block |
| `_bonusLifeReduction` | บาง spirit | ลด life เพิ่ม X |
| `_rumbleN` | Rumble spirits | จำนวน cards ที่ Rumble discard |
| `_rumbleBonus` | บาง effect | bonus ต่อ Rumble count |
| `_rumbleBoost` | บาง nexus | persistent Rumble bonus |
| `_prevBlockerBP` | engine ใช้ภายใน | BP ของ blocker (ใช้ใน onAttackWin) |
| `_clashActive` | Clash keyword | กำลัง Clash อยู่ |
| `flashUsedThisBattle` | Invoke Flash | ใช้ flash ใน battle นี้แล้ว |
| `blockInvokeUsed` | Block Invoke | ใช้ block invoke แล้ว |
| `_refreshUsed` | Current Invoke | Invoke flash ใช้แล้ว |
| `_oncePerTurnUsed` | บาง spirit | ใช้ effect once-per-turn แล้ว |

### Nexus Flags

| Flag | ความหมาย |
|---|---|
| `_grooveBoostUsed` | Groove bonus ใช้ใน turn นี้แล้ว |

### Player-Level Flags (reset ต่อ turn)

| Flag | ความหมาย |
|---|---|
| `_depletedOpponentThisTurn` | ทำให้ opp spirit depleted ใน turn นี้ |
| `_usedTopazMagicThisTurn` | เล่น Topaz magic ใน turn นี้ |
| `_usedThunderDragonMagicThisTurn` | เล่น Thunder Dragon magic ใน turn นี้ |

### Game-Level Flags

| Flag | ความหมาย |
|---|---|
| `_lifeReducedThisTurn` | life ถูกลดใน turn นี้ (ไม่ว่าฝ่ายไหน attack) |

---

## 11. Core / Payment System

### Core Zones

```
player.reserve      { normal: N, soul: bool }   ← Cores พักอยู่ที่นี่
player.trashCore    { normal: N, soul: bool }   ← Cores ที่ถูกจ่ายไปแล้ว (void)
spirit.cores        { normal: N, soul: bool }
nexus.cores         { normal: N, soul: bool }
```

### paySpec (การเลือกจ่าย cost จาก zones ใดก็ได้)

```js
paySpec = {
  reserve: { normal: N, soul: bool },
  spirits: { [uid]: { normal: N, soul: bool }, ... },
  nexuses: { [uid]: { normal: N, soul: bool }, ... },
}
```

ใช้กับ: `summonWithSpecs()`, `playMagic(paySpec)`, `playFlashMagic(paySpec)`

### placeSpec (การเลือกวาง cores บน spirit ที่ summon)

```js
placeSpec = {
  reserve: { normal: N, soul: bool },
  spirits: { [uid]: { normal: N, soul: bool }, ... },
  nexuses: { [uid]: { normal: N, soul: bool }, ... },
}
```

ใช้กับ: `summonWithSpecs(handIndex, paySpec, placeSpec)`

---

## 12. Level / True Release System

```js
function meetsLevelReq(entry, total, hasSoul) {
  if (entry.trueRelease) return hasSoul || total >= entry.cores;
  return total >= entry.cores;
}
```

- **LV1** = ถือ cores ≥ `levels[0].cores` (ปกติ 0–1)
- **LV2 (ปกติ)** = ถือ cores ≥ `levels[1].cores`
- **LV2 (True Release)** = ถือ soul core **หรือ** cores ≥ `levels[1].cores`
- **Nexus** ก็ใช้ `getCardLevel()` เหมือนกัน

---

## 13. Soul Magic

Soul Magic = magic card ที่ `keyword: "Soul Magic"` และมี Flash effect  
เงื่อนไขพิเศษ: ถ้ามี **soul core ใน reserve** และมี **symbol สีเดียวกับ card** ≥ 1 → จ่ายด้วย soul core เดียวได้ (ฟรี)

```js
// ใน canPlayFlashMagic():
const isSoulMagic = card.keyword === "Soul Magic"
  && player.reserve.soul
  && countSymbols(player, card.color) > 0;
const actualCost = isSoulMagic ? 0 : Math.max(0, card.cost - reduction);
```

เมื่อ play → soul core ถูกส่งจาก `reserve.soul` → `trashCore.soul`

---

## 14. Flash Window Flow

```
declareAttack(attackerUid)
  │
  ├── Trigger onStartAttackStep hooks
  ├── Trigger onAttack hooks (set flags)
  └── _hasAnyFlashAction() ?
        ├── YES → awaitingFlash = { attackerUid }  [Flash Window เปิด]
        │         Human เห็น Flash Modal
        │         ├── playFlashMagic() → ใช้ magic
        │         ├── invokeFlash() → spirit Invoke Flash
        │         ├── invokeNexusFlash() → nexus Invoke Flash
        │         └── passFlash() → ปิด Flash Window
        └── NO  → _proceedToBattle() ทันที

_proceedToBattle(attackerUid)
  │
  ├── AI: ใช้ aiBlockChooser เลือก blocker
  └── Human: awaitingBlock = { attackerUid, defenderId:0 }
              Human เห็น Block Modal
              └── defendWith(blockerUid | null)
                    └── resolveBattle(attackerUid, blockerUid)
```

### Auto-pass Flash (ใน app.js)
ฟังก์ชัน `_tryAutoPassFlash()` ใน app.js จะ auto-pass เมื่อ Human ไม่มี Flash action เหลือ:
- ไม่มี flash magic ที่ play ได้
- ไม่มี Invoke Flash ที่ใช้ได้
- ไม่มี Nexus Invoke Flash ที่ใช้ได้

---

## 15. การเพิ่ม Card Effect ใหม่

### Spirit with summon effect
```js
// ใน CARD_EFFECTS:
rsdXXXXXCardName: {
  onSummon(game, spirit, player) {
    const opp = game._opp(player);
    // AI path
    if (player.isAi) {
      const best = opp.spirits[0];
      if (best) game._bpDamage(opp, best.uid, 2000);
      return;
    }
    // Human path: set awaitingEffect
    const targets = opp.spirits.map((s) => s.uid);
    if (!targets.length) return; // ถ้าไม่มี target ไม่ต้อง set
    game.awaitingEffect = {
      type: "bpDamage2000",
      label: "CardName: -2000 BP",
      sourceUid: spirit.uid,
      ownerId: player.id,
      validTargets: targets,
      optional: true,            // false = บังคับเลือก
      pendingBattleAttackerUid: null,
    };
  },
},
```

### Flash Magic effect
```js
// ใน MAGIC_FLASH_EFFECTS:
rsdXXXXXCardName: {
  getFlashTargets(game, player) {
    return game._opp(player).spirits
      .filter((s) => /* condition */)
      .map((s) => ({ uid: s.uid, label: `${s.name} (effect)` }));
  },
  flash(game, player, targetUid) {
    const opp = game._opp(player);
    const t = opp.spirits.find((s) => s.uid === targetUid);
    if (!t) return;
    // do effect
    game.addLog(`CardName: effect on ${t.name}.`);
  },
},
```

### Nexus Invoke Flash
```js
// ใน NEXUS_FLASH_HANDLERS:
rsdXXXXXNexusName: {
  canInvoke(nexus, player, attackerUid) {
    if (nexus.exhausted) return false;
    const atk = player.spirits.find((s) => s.uid === attackerUid);
    return atk && isFamilyName(atk.cardId); // เช็ค family
  },
  invoke(game, nexus, player, attackerUid) {
    nexus.exhausted = true;
    const atk = player.spirits.find((s) => s.uid === attackerUid);
    if (atk) {
      atk.bpBoost = (atk.bpBoost ?? 0) + 2000;
      game.addLog(`${nexus.name}: Invoke Flash – ${atk.name} +2000 BP.`);
    }
  },
},
```

### เพิ่ม awaitingEffect type ใหม่
1. เพิ่ม case ใน `resolveEffect()` ใน `BattleSpiritGame`
2. เพิ่ม type ใน set ที่ถูกต้องใน `renderEffectModal()` ใน `app.js`:
   - `OWN_SPIRIT_EFFECTS` — ถ้า target เป็น own spirit
   - `OPP_SPIRIT_EFFECTS` — ถ้า target เป็น opp spirit
   - หรือเขียน branch แยกถ้า target เป็น nexus / card จาก trash
3. อัพเดท Section 9 ของไฟล์นี้

---

*อัพเดทล่าสุด: implement rbs01070Steguman (triggerSummonEffect), rbs01091TheLayeredVermilionClouds (post-battle Clash BP boost + coreFloorOne LV2), rbs01093TheDowndraftDragonCurrent (onDrawStep + NEXUS_FLASH_HANDLERS LV2), rbs01096HuntingTree (post-BP-comparison draw+sendCore), rbs01100/rbs01102 DualFlowDesert/RockPit (Amplify block restriction + post-battle core from Trash), rbs01119GuardEffect (_magicImmune); เพิ่ม onDrawStep hook ใน startTurn, _coreFloorOne ใน _sendCores, _magicImmune filter ใน flash magic targets*
