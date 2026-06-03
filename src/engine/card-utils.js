import { CARD_POOL } from "../data/cards.js";

export function getCardLevel(spirit, card) {
  const hasSoul = !!spirit.cores.soul;
  const total = spirit.cores.normal + (hasSoul ? 1 : 0);
  let lv = 1;
  for (const entry of card.levels ?? []) {
    if (meetsLevelReq(entry, total, hasSoul)) lv = entry.level;
  }
  return lv;
}

export function getEffectiveBP(spirit, card) {
  const hasSoul = !!spirit.cores.soul;
  const total = spirit.cores.normal + (hasSoul ? 1 : 0);
  let bp = card.levels?.[0]?.bp ?? card.bp ?? 0;
  for (const entry of card.levels ?? []) {
    if (meetsLevelReq(entry, total, hasSoul)) bp = entry.bp ?? bp;
  }
  return bp + (spirit.bpBoost ?? 0);
}

function meetsLevelReq(entry, total, hasSoul) {
  const req = entry.cores;
  if (typeof req === "string" && req.includes("/")) {
    return total >= parseInt(req, 10) || hasSoul;
  }
  if (entry.trueRelease) {
    return hasSoul || total >= req;
  }
  return total >= req;
}

export function hasFamily(cardId, family) {
  const f = CARD_POOL[cardId]?.family;
  if (!f) return false;
  if (Array.isArray(f)) return f.includes(family);
  return f === family || f.includes(family);
}

export function draw(player, amount) {
  for (let i = 0; i < amount; i += 1) {
    const id = player.deck.shift();
    if (!id) break;
    player.hand.push(id);
  }
}
