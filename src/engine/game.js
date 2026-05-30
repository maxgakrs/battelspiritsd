import { CARD_POOL, DECKS } from "../data/cards.js";

const PHASES = { MAIN: "MAIN", ATTACK: "ATTACK", MAIN2: "MAIN2" };
const PHASE_ORDER = [PHASES.MAIN, PHASES.ATTACK, PHASES.MAIN2];

function shuffle(cards) {
  const copy = [...cards];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
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

function hasFamily(cardId, family) {
  const f = CARD_POOL[cardId]?.family;
  if (!f) return false;
  if (Array.isArray(f)) return f.includes(family);
  return f === family || f.includes(family);
}
function isWindfang(id) { return hasFamily(id, "Windfang"); }
function isArmoredFish(id) { return hasFamily(id, "Armored Fish"); }
function isMineroid(id) { return hasFamily(id, "Mineroid"); }
function isThunderDragon(id) { return hasFamily(id, "Thunder Dragon"); }
function isFerobeast(id) { return hasFamily(id, "Ferobeast"); }
function isBloodrouse(id) { return hasFamily(id, "Bloodrouse"); }
function isRedCloud(id) { return hasFamily(id, "Red Cloud"); }
function isDarkPuce(id) { return hasFamily(id, "Dark Puce"); }
function isOceanicGreen(id) { return hasFamily(id, "Oceanic Green"); }
function isLeucomyst(id) { return hasFamily(id, "Leucomyst"); }
function isTopaz(id) { return hasFamily(id, "Topaz"); }
function isCyantree(id) { return hasFamily(id, "Cyantree"); }
function isEchochant(id) { return hasFamily(id, "Echochant"); }

function hasKeyword(cardId, kw) {
  const k = CARD_POOL[cardId]?.keyword;
  if (!k) return false;
  const lk = kw.toLowerCase();
  if (Array.isArray(k)) return k.some((x) => x.toLowerCase().includes(lk));
  return typeof k === "string" && k.toLowerCase().includes(lk);
}
function hasClash(cardId) { return hasKeyword(cardId, "Clash"); }
function hasShamanism(cardId) { return hasKeyword(cardId, "Shamanism"); }
function hasRumble(cardId) { return hasKeyword(cardId, "Rumble"); }
function hasAmplify(cardId) { return hasKeyword(cardId, "Amplify"); }
function hasCurrent(cardId) { return hasKeyword(cardId, "Current"); }

function getRumbleN(spirit) {
  const card = CARD_POOL[spirit.cardId];
  if (!card) return 0;
  for (const eff of card.effects ?? []) {
    const m = eff.condition?.match(/Rumble:\s*(\d+)/);
    if (m) return parseInt(m[1], 10);
  }
  return 0;
}

// --- Card effect handlers ---

const CARD_EFFECTS = {
  rsd01001Mushakko: {
    onAttack(_game, spirit, _player, level) {
      if (level < 2) return;
      spirit._drawOnBattleEnd = true;
    },
  },

  rsd01002GenBor: {
    onAttack(game, spirit, _player, level) {
      if (level < 2) return;
      spirit.bpBoost = (spirit.bpBoost ?? 0) + 2000;
      game.addLog(`${spirit.name}: +2000 BP (LV2).`);
    },
  },

  rsd01003Rowamiku: {
    onSummon(game, spirit, player) {
      const hasExhaustedRed = player.spirits.some(
        (s) => s.color === "red" && s.exhausted && s.uid !== spirit.uid,
      );
      if (!hasExhaustedRed) return;
      const opp = game._opp(player);
      const targets = opp.spirits.filter(
        (s) => getEffectiveBP(s, CARD_POOL[s.cardId]) <= 3000,
      );
      if (!targets.length) return;
      game._effectOrAuto(player, targets, spirit.uid, null,
        "Rowamiku: Destroy opposing Spirit (≤3000 BP)", false);
    },
  },

  rsd01004Haarier: {
    onAttack(game, spirit, player, level) {
      if (level < 2) return;
      const revealed = player.deck.splice(0, 2);
      const wf = revealed.find((id) => isWindfang(id));
      const toHand = wf ? [wf] : [];
      const toTrash = wf ? revealed.filter((id) => id !== wf) : [...revealed];
      game.awaitingEffect = {
        type: "deckReveal", label: `${spirit.name}: Reveal`,
        sourceName: spirit.name, ownerId: player.id,
        revealed, toHand, toBottom: [], toTrash,
        validTargets: [], optional: false, pendingBattleAttackerUid: spirit.uid,
      };
    },
  },

  rsd01006Cupell: {
    onSummon(game, spirit, player) {
      const n = Math.min(2, player.trashCore.normal);
      if (n > 0) {
        player.trashCore.normal -= n;
        spirit.cores.normal += n;
        game.addLog(`${spirit.name}: +${n} core(s) from Trash.`);
      }
    },
    onEndStep(game, spirit, player, level) {
      if (level < 2) return;
      if (!player.trashCore.soul) return;
      const targets = [
        ...player.spirits.filter((s) => isWindfang(s.cardId) && !s.cores.soul),
        ...player.nexuses.filter((n) => isWindfang(n.cardId) && !n.cores.soul),
      ];
      if (!targets.length) return;
      if (player.isAi) {
        const target = targets[0];
        player.trashCore.soul = false;
        target.cores.soul = true;
        game.addLog(`${spirit.name}: Soul Core Trash → ${target.name}.`);
      } else {
        game.awaitingEffect = {
          type: "sendSoulFromTrash",
          label: `${spirit.name}: Send Soul Core from Trash to a Windfang`,
          sourceName: spirit.name,
          ownerId: player.id,
          validTargets: targets.map((t) => t.uid),
          optional: false,
          pendingBattleAttackerUid: null,
        };
      }
    },
  },

  rsd01007Griffar: {
    onAttack(game, spirit, player, level, attackerUid) {
      if (level < 2) return;
      const opp = game._opp(player);
      const targets = opp.spirits.filter(
        (s) => getEffectiveBP(s, CARD_POOL[s.cardId]) <= 3000,
      );
      if (!targets.length) return;
      game._effectOrAuto(player, targets, spirit.uid, attackerUid,
        "Griffar: Destroy opposing Spirit (≤3000 BP)", false);
    },
  },

  rsd01008Sertarius: {
    onSummon(game, spirit, player) {
      const opts = player.trash.filter(
        (id) => isWindfang(id) && id !== "rsd01008Sertarius",
      );
      if (!opts.length) return;
      if (player.isAi) {
        const pick = opts.sort(
          (a, b) => (CARD_POOL[b]?.cost ?? 0) - (CARD_POOL[a]?.cost ?? 0),
        )[0];
        player.trash.splice(player.trash.lastIndexOf(pick), 1);
        player.hand.push(pick);
        game.addLog(`${spirit.name}: returned ${CARD_POOL[pick]?.name}.`);
      } else {
        game.awaitingEffect = {
          type: "returnCardFromTrash",
          label: "Sertarius: Return a Windfang Spirit from Trash",
          sourceUid: spirit.uid,
          ownerId: player.id,
          validTargets: [...new Set(opts)],
          optional: false,
          pendingBattleAttackerUid: null,
        };
      }
    },
  },

  rsd01009TheFlyingAceReufalx: {
    onSummon(game, spirit, player) {
      const hasExhWF = player.spirits.some(
        (s) => isWindfang(s.cardId) && s.exhausted && s.uid !== spirit.uid,
      );
      if (!hasExhWF) return;
      const opp = game._opp(player);
      const targets = opp.spirits.filter(
        (s) => getEffectiveBP(s, CARD_POOL[s.cardId]) <= 5000,
      );
      if (!targets.length) return;
      game._effectOrAuto(player, targets, spirit.uid, null,
        "Reufalx: Destroy opposing Spirit (≤5000 BP)", false);
    },
    onAttack(game, spirit, _player, level) {
      if (level < 2) return;
      spirit.bpBoost = (spirit.bpBoost ?? 0) + 2000;
      game.addLog(`${spirit.name}: +2000 BP (LV2).`);
    },
  },

  rsd01011TheFloatingStoneRealm: {
    onDeploy(game, nexus, player) {
      const hasExhRed = player.spirits.some(
        (s) => s.color === "red" && s.exhausted,
      );
      if (!hasExhRed) return;
      const opts = player.trash.filter((id) => {
        const c = CARD_POOL[id];
        return isWindfang(id) && c?.type === "spirit" && (c?.cost ?? 0) <= 4;
      });
      if (!opts.length) return;
      if (player.isAi) {
        const pick = opts.sort(
          (a, b) => (CARD_POOL[b]?.cost ?? 0) - (CARD_POOL[a]?.cost ?? 0),
        )[0];
        player.trash.splice(player.trash.lastIndexOf(pick), 1);
        player.hand.push(pick);
        game.addLog(`${nexus.name}: returned ${CARD_POOL[pick]?.name}.`);
      } else {
        game.awaitingEffect = {
          type: "returnCardFromTrash",
          label: "Floating Stone Realm: Return Cost ≤4 Windfang Spirit from Trash",
          sourceUid: nexus.uid,
          ownerId: player.id,
          validTargets: [...new Set(opts)],
          optional: false,
          pendingBattleAttackerUid: null,
        };
      }
    },
  },

  rsd01X01TheFlyingScarletRensis: {
    onSummon(game, spirit, player) {
      const opp = game._opp(player);
      const targets = opp.spirits.filter(
        (s) => getEffectiveBP(s, CARD_POOL[s.cardId]) <= 7000,
      );
      if (!targets.length) return;
      game._effectOrAuto(player, targets, spirit.uid, null,
        "Rensis: Destroy opposing Spirit (≤7000 BP)", false);
    },
    onAttack(game, spirit, player, level) {
      if (level < 2) return;
      const wfSpirits = player.spirits.filter((s) => isWindfang(s.cardId));
      if (!wfSpirits.length || !player.trashCore.normal) return;
      const target = [...wfSpirits].sort(
        (a, b) => getEffectiveBP(b, CARD_POOL[b.cardId]) - getEffectiveBP(a, CARD_POOL[a.cardId]),
      )[0];
      const n = Math.min(2, player.trashCore.normal);
      player.trashCore.normal -= n;
      target.cores.normal += n;
      game.addLog(`${spirit.name}: sent ${n} core(s) to ${target.name}.`);
    },
  },

  rsd01X02TheFlyingIronAkurai: {
    onAttack(game, spirit, player, level) {
      if (level < 2) return;
      const revealed = player.deck.splice(0, 3);
      const wf = revealed.find((id) => isWindfang(id));
      const toHand = wf ? [wf] : [];
      const toTrash = wf ? revealed.filter((id) => id !== wf) : [...revealed];
      game.awaitingEffect = {
        type: "deckReveal", label: `${spirit.name}: Reveal`,
        sourceName: spirit.name, ownerId: player.id,
        revealed, toHand, toBottom: [], toTrash,
        validTargets: [], optional: false, pendingBattleAttackerUid: spirit.uid,
      };
    },
  },

  // RSD02 — Bloodrouse
  rsd02001Sclouse: {
    onDestroy(game, spirit, player) {
      const level = getCardLevel(spirit, CARD_POOL[spirit.cardId]);
      if (level < 2) return;
      const opp = game._opp(player);
      const target = opp.spirits.filter((s) => s.cores.normal > 0)
        .sort((a, b) => b.cores.normal - a.cores.normal)[0];
      if (!target) return;
      game._sendCores(opp, target.uid, 1);
      game.addLog(`${spirit.name}: 1 core from ${target.name}.`);
    },
  },

  rsd02002Firalba: {
    onDestroy(game, _spirit, player) {
      draw(player, 1);
      game.addLog(`Firalba: drew 1 card on destroy.`);
    },
  },

  rsd02003MediciCattery: {
    onAttack(game, spirit, _player, level) {
      if (level < 2) return;
      spirit.bpBoost = (spirit.bpBoost ?? 0) + 3000;
      game.addLog(`${spirit.name}: +3000 BP (True Release).`);
    },
  },

  rsd02004Garsis: {
    onAttack(game, spirit, player, level, attackerUid) {
      if (level < 2) return;
      const opp = game._opp(player);
      const targets = opp.spirits.filter((s) => (CARD_POOL[s.cardId]?.cost ?? 0) <= 4 && s.cores.normal > 0);
      if (!targets.length) return;
      if (player.isAi) {
        const best = targets.sort((a, b) => b.cores.normal - a.cores.normal)[0];
        game._sendCores(opp, best.uid, 1);
        game.addLog(`${spirit.name}: 1 core from ${best.name}.`);
      } else {
        game.awaitingEffect = { type: "sendCoreFromSpirit", label: "Garsis: Send core from opposing Cost ≤4 Spirit", sourceUid: spirit.uid, ownerId: player.id, validTargets: targets.map((t) => t.uid), optional: false, pendingBattleAttackerUid: attackerUid };
      }
    },
  },

  rsd02006RamToker: {
    onSummon(game, _spirit, player) { draw(player, 1); game.addLog(`Ram Toker: drew 1 card.`); },
  },

  rsd02007LadyLamica: {
    onSummon(game, spirit, player) {
      const hasExh = player.spirits.some((s) => isBloodrouse(s.cardId) && s.exhausted && s.uid !== spirit.uid);
      if (!hasExh) return;
      const opp = game._opp(player);
      const targets = opp.spirits.filter((s) => s.cores.normal > 0);
      if (!targets.length) return;
      if (player.isAi) {
        const best = targets.sort((a, b) => b.cores.normal - a.cores.normal)[0];
        game._sendCores(opp, best.uid, 1);
        game.addLog(`${spirit.name}: 1 core from ${best.name}.`);
      } else {
        game.awaitingEffect = { type: "sendCoreFromSpirit", label: "Lady Lamica: Send core from opposing Spirit", sourceUid: spirit.uid, ownerId: player.id, validTargets: targets.map((t) => t.uid), optional: false, pendingBattleAttackerUid: null };
      }
    },
    onAttack(game, spirit, _player, level) {
      if (level < 2) return;
      spirit.bpBoost = (spirit.bpBoost ?? 0) + 2000;
      game.addLog(`${spirit.name}: +2000 BP (True Release).`);
    },
  },

  rsd02008Ogrul: {
    onAttack(game, spirit, player, level, attackerUid) {
      if (level < 2) return;
      const opp = game._opp(player);
      const targets = opp.spirits.filter((s) => s.cores.normal > 0);
      if (!targets.length) return;
      if (player.isAi) {
        const best = targets.sort((a, b) => b.cores.normal - a.cores.normal)[0];
        game._sendCores(opp, best.uid, 1);
        game.addLog(`${spirit.name}: 1 core from ${best.name}.`);
      } else {
        game.awaitingEffect = { type: "sendCoreFromSpirit", label: "Ogrul: Send core from opposing Spirit", sourceUid: spirit.uid, ownerId: player.id, validTargets: targets.map((t) => t.uid), optional: false, pendingBattleAttackerUid: attackerUid };
      }
    },
  },

  rsd02X01TheHeadNurseNephila: {
    onSummon(game, spirit, player) {
      const opp = game._opp(player);
      const targets = opp.spirits.filter((s) => s.cores.normal > 1);
      if (!targets.length) return;
      if (player.isAi) {
        const best = targets.sort((a, b) => b.cores.normal - a.cores.normal)[0];
        game._drainToOne(opp, best.uid);
        game.addLog(`${spirit.name}: drained ${best.name} to 1 core.`);
      } else {
        game.awaitingEffect = { type: "drainToOne", label: "Nephila: Drain opposing Spirit to 1 core", sourceUid: spirit.uid, ownerId: player.id, validTargets: targets.map((t) => t.uid), optional: false, pendingBattleAttackerUid: null };
      }
    },
    onAttack(game, spirit, player, level, attackerUid) {
      if (level < 2) return;
      const opp = game._opp(player);
      const targets = opp.spirits.filter((s) => s.cores.normal > 0);
      if (!targets.length) return;
      if (player.isAi) {
        const best = targets.sort((a, b) => b.cores.normal - a.cores.normal)[0];
        const depleted = game._sendCores(opp, best.uid, 1);
        if (depleted) { draw(player, 1); game.addLog(`${spirit.name}: drew 1 (depleted).`); }
        game.addLog(`${spirit.name}: 1 core from ${best.name}.`);
      } else {
        game.awaitingEffect = { type: "sendCoreAndDrawIfDepleted", label: "Nephila: Send core (draw if depleted)", sourceUid: spirit.uid, ownerId: player.id, validTargets: targets.map((t) => t.uid), optional: false, pendingBattleAttackerUid: attackerUid };
      }
    },
  },

  rsd02X02EmperorPerigorouge: {
    onSummon(game, spirit, player) {
      const hasExh = player.spirits.some((s) => isBloodrouse(s.cardId) && s.exhausted && s.uid !== spirit.uid);
      const opp = game._opp(player);
      const targets = [...opp.spirits].filter((s) => s.cores.normal > 0).sort((a, b) => b.cores.normal - a.cores.normal);
      if (!targets.length) return;
      let remaining = hasExh ? 4 : 2;
      for (const t of targets) {
        if (remaining <= 0) break;
        const send = Math.min(t.cores.normal, remaining);
        game._sendCores(opp, t.uid, send);
        remaining -= send;
      }
      game.addLog(`${spirit.name}: sent ${hasExh ? 4 : 2} total cores from opposing Spirits.`);
    },
    onAttack(game, spirit, player, level) {
      if (level < 2) return;
      if (!player._depletedOpponentThisTurn) return;
      spirit._cantBeBlockedCostLimit = 4;
      game.addLog(`${spirit.name}: can't be blocked by Cost ≤4 (opposing Spirit was depleted).`);
    },
  },

  // RSD03 — Armored Fish
  rsd03002Puffer: {
    onSummon(game, _spirit, player) { player.trashCore.normal += 1; game.addLog(`Puffer: core → Trash.`); },
  },

  rsd03003Rassehead: {
    onSummon(game, spirit, player) {
      const opp = game._opp(player);
      const targets = opp.spirits.filter((s) => (CARD_POOL[s.cardId]?.cost ?? 0) <= 4 && !s.exhausted);
      if (!targets.length) return;
      if (player.isAi) {
        const best = targets.sort((a, b) => getEffectiveBP(b, CARD_POOL[b.cardId]) - getEffectiveBP(a, CARD_POOL[a.cardId]))[0];
        best.exhausted = true;
        game.addLog(`${spirit.name}: exhausted ${best.name}.`);
      } else {
        game.awaitingEffect = { type: "exhaustSpirit", label: "Rassehead: Exhaust opposing Cost ≤4 Spirit", sourceUid: spirit.uid, ownerId: player.id, validTargets: targets.map((t) => t.uid), optional: true, pendingBattleAttackerUid: null };
      }
    },
    onAttack(game, spirit, _player, level) {
      if (level < 2) return;
      spirit.bpBoost = (spirit.bpBoost ?? 0) + 2000;
      game.addLog(`${spirit.name}: +2000 BP (True Release).`);
    },
  },

  rsd03006TheOceanPhantomCoelaCanth: {
    onSummon(game, spirit, player) {
      const others = player.spirits.filter((s) => isArmoredFish(s.cardId) && s.uid !== spirit.uid);
      if (others.length) { others[0].cores.normal += 1; game.addLog(`${spirit.name}: core → ${others[0].name}.`); }
      const hasExhFish = player.spirits.some((s) => isArmoredFish(s.cardId) && s.exhausted);
      if (hasExhFish) {
        const t = player.spirits.find((s) => s.exhausted);
        if (t) { t.exhausted = false; game.addLog(`${spirit.name}: refreshed ${t.name}.`); }
      }
    },
  },

  rsd03007Garizarot: {
    onAttack(game, spirit, _player, level) {
      spirit._forceExhaustedBlock = true;
      if (level < 2) return;
      spirit.bpBoost = (spirit.bpBoost ?? 0) + 2000;
      game.addLog(`${spirit.name}: +2000 BP (True Release).`);
    },
  },

  rsd03008TheHeavyJawsDorogoliath: {
    onAttack(game, spirit, player, level, attackerUid) {
      const fishCount = player.spirits.filter((s) => isArmoredFish(s.cardId)).length;
      if (fishCount) { spirit.bpBoost = (spirit.bpBoost ?? 0) + fishCount * 1000; game.addLog(`${spirit.name}: +${fishCount * 1000} BP.`); }
      if (level < 2) return;
      const opp = game._opp(player);
      const targets = opp.spirits.filter((s) => (CARD_POOL[s.cardId]?.cost ?? 0) <= 3 && !s.exhausted);
      if (!targets.length) return;
      if (player.isAi) {
        const best = targets.sort((a, b) => getEffectiveBP(b, CARD_POOL[b.cardId]) - getEffectiveBP(a, CARD_POOL[a.cardId]))[0];
        best.exhausted = true;
        game.addLog(`${spirit.name}: exhausted ${best.name}.`);
      } else {
        game.awaitingEffect = { type: "exhaustSpirit", label: "Dorogoliath: Exhaust opposing Cost ≤3 Spirit", sourceUid: spirit.uid, ownerId: player.id, validTargets: targets.map((t) => t.uid), optional: true, pendingBattleAttackerUid: attackerUid };
      }
    },
  },

  rsd03009TheTransparentHoodOlindias: {
    onSummon(game, spirit, player) {
      const revealed = player.deck.splice(0, 3);
      const pick = revealed.find((id) => { const c = CARD_POOL[id]; return isArmoredFish(id) && (c?.cost ?? 99) <= 3; });
      const toHand = pick ? [pick] : [];
      const toBottom = pick ? revealed.filter((id) => id !== pick) : [...revealed];
      game.awaitingEffect = {
        type: "deckReveal", label: `${spirit.name}: Reveal`,
        sourceName: spirit.name, ownerId: player.id,
        revealed, toHand, toBottom, toTrash: [],
        validTargets: [], optional: false, pendingBattleAttackerUid: null,
      };
    },
    onBlock(game, spirit, player, level) {
      if (level < 2) return;
      const opp = game._opp(player);
      const targets = opp.spirits.filter((s) => !s.exhausted);
      if (!targets.length) return;
      if (player.isAi) {
        const best = targets.sort((a, b) => getEffectiveBP(b, CARD_POOL[b.cardId]) - getEffectiveBP(a, CARD_POOL[a.cardId]))[0];
        best.exhausted = true;
        game.addLog(`${spirit.name}: exhausted ${best.name} on block.`);
      }
    },
  },

  rsd03X01TheArmoredHandsSquid: {
    onSummon(game, spirit, player) {
      const opp = game._opp(player);
      const targets = opp.spirits.filter((s) => s.exhausted);
      if (!targets.length) return;
      if (player.isAi) {
        const best = targets.sort((a, b) => getEffectiveBP(b, CARD_POOL[b.cardId]) - getEffectiveBP(a, CARD_POOL[a.cardId]))[0];
        game.addLog(`${spirit.name}: heavy exhausted ${best.name}.`);
      } else {
        game.awaitingEffect = { type: "exhaustSpirit", label: "ArmoredHands Squid: Heavy exhaust opposing exhausted Spirit", sourceUid: spirit.uid, ownerId: player.id, validTargets: targets.map((t) => t.uid), optional: true, pendingBattleAttackerUid: null };
      }
    },
    onAttack(_game, spirit, _player, level) {
      if (level < 2) return;
      spirit._refreshAfterBattle = true;
    },
  },

  rsd03X02TheDeepNestDuntekleo: {
    onSummon(game, spirit, player) {
      const targets = player.spirits.filter((s) => isArmoredFish(s.cardId) && s.uid !== spirit.uid).slice(0, 2);
      for (const t of targets) { t.bpBoost = (t.bpBoost ?? 0) + 3000; game.addLog(`${spirit.name}: ${t.name} +3000 BP.`); }
    },
  },

  // RSD04 — Mineroid
  rsd04001Atun: {
    onBlock(game, spirit, player, level) {
      if (level < 2) return;
      const nx = player.nexuses.find((n) => isMineroid(n.cardId));
      if (!nx) return;
      nx.cores.normal += 1;
      game.addLog(`${spirit.name}: core → ${nx.name}.`);
    },
  },

  rsd04002Nonril: {
    onSummon(game, _spirit, player) { player.trashCore.normal += 1; game.addLog(`Nonril: core → Trash.`); },
    onBlock(game, spirit, player, level) {
      if (level < 2) return;
      if (countSymbols(player, "white") < 3) return;
      spirit.bpBoost = (spirit.bpBoost ?? 0) + 5000;
      game.addLog(`${spirit.name}: +5000 BP during block.`);
    },
  },

  rsd04003Arsinus: {},

  rsd04004TheHeavyClawForclawer: {
    onStartOpposingAttackStep(game, spirit, player, _level) {
      const opp = game._opp(player);
      const candidates = opp.spirits.filter((s) => !s.exhausted);
      if (!candidates.length) return;
      if (player.isAi) {
        const target = candidates.sort((a, b) => getEffectiveBP(a, CARD_POOL[a.cardId]) - getEffectiveBP(b, CARD_POOL[b.cardId]))[0];
        target._mustAttackFirst = true;
        game.addLog(`${spirit.name}: ${target.name} must attack first!`);
      } else {
        game.awaitingEffect = {
          type: "forceAttack",
          label: "Forclawer: Choose opposing Spirit to force attack first",
          sourceUid: spirit.uid,
          ownerId: player.id,
          validTargets: candidates.map((t) => t.uid),
          optional: true,
          pendingBattleAttackerUid: null,
        };
      }
    },
  },

  rsd04006Dabity: {
    onSummon(game, spirit, player) {
      const targets = player.spirits.filter((s) => isMineroid(s.cardId) && s.uid !== spirit.uid);
      if (!targets.length) return;
      const t = targets.sort((a, b) => a.cores.normal - b.cores.normal)[0];
      t.cores.normal += 1;
      game.addLog(`${spirit.name}: core → ${t.name}.`);
    },
    onBlock(game, spirit, _player, level) {
      if (level < 2) return;
      spirit.bpBoost = (spirit.bpBoost ?? 0) + 2000;
      game.addLog(`${spirit.name}: +2000 BP during block.`);
    },
  },

  rsd04007Junks: {
    onEndStep(game, spirit, _player, _level) {
      if (!spirit.exhausted) return;
      spirit.exhausted = false;
      game.addLog(`${spirit.name}: refreshed at end step.`);
    },
    onAttack(game, spirit, player, level, attackerUid) {
      if (level < 2) return;
      const opp = game._opp(player);
      const targets = opp.spirits.filter((s) => getEffectiveBP(s, CARD_POOL[s.cardId]) <= 4000);
      if (!targets.length) return;
      if (player.isAi) {
        const best = targets.sort((a, b) => getEffectiveBP(b, CARD_POOL[b.cardId]) - getEffectiveBP(a, CARD_POOL[a.cardId]))[0];
        game._returnToHand(opp, best.uid);
      } else {
        game.awaitingEffect = { type: "returnToHand", label: "Junks: Return opposing ≤4000 BP Spirit to Hand", sourceUid: spirit.uid, ownerId: player.id, validTargets: targets.map((t) => t.uid), optional: false, pendingBattleAttackerUid: attackerUid };
      }
    },
  },

  rsd04008TheMightyArmAnatoma: {
    onSummon(game, spirit, player) {
      const opp = game._opp(player);
      const targets = opp.spirits.filter((s) => getEffectiveBP(s, CARD_POOL[s.cardId]) <= 6000);
      if (!targets.length) return;
      if (player.isAi) {
        const best = targets.sort((a, b) => getEffectiveBP(b, CARD_POOL[b.cardId]) - getEffectiveBP(a, CARD_POOL[a.cardId]))[0];
        game._returnToHand(opp, best.uid);
      } else {
        game.awaitingEffect = { type: "returnToHand", label: "Anatoma: Return opposing ≤6000 BP Spirit to Hand", sourceUid: spirit.uid, ownerId: player.id, validTargets: targets.map((t) => t.uid), optional: false, pendingBattleAttackerUid: null };
      }
    },
  },

  rsd04X01TheContinentalShipMatanda: {
    onEndStep(game, spirit, player, _level) {
      const targets = player.spirits.filter((s) => isMineroid(s.cardId) && s.exhausted && s.uid !== spirit.uid).slice(0, 2);
      for (const t of targets) { t.exhausted = false; game.addLog(`${spirit.name}: refreshed ${t.name}.`); }
    },
    onAttack(game, spirit, _player, level) {
      if (level < 2) return;
      spirit._cantBeBlockedCostLimit = 7;
      game.addLog(`${spirit.name}: can't be blocked by Cost ≤7.`);
    },
  },

  rsd04X02TheTrueGateMinisterSavatoma: {
    onSummon(game, spirit, player) {
      const hasExhMin = player.spirits.some((s) => isMineroid(s.cardId) && s.exhausted && s.uid !== spirit.uid);
      const opp = game._opp(player);
      if (!opp.spirits.length) return;
      if (player.isAi) {
        const best = opp.spirits.sort((a, b) => getEffectiveBP(b, CARD_POOL[b.cardId]) - getEffectiveBP(a, CARD_POOL[a.cardId]))[0];
        if (hasExhMin) game._returnToDeckBottom(opp, best.uid);
        else game._returnToHand(opp, best.uid);
      } else {
        game.awaitingEffect = { type: hasExhMin ? "returnToDeckBottom" : "returnToHand", label: hasExhMin ? "Savatoma: Return opposing Spirit to deckbottom" : "Savatoma: Return opposing Spirit to Hand", sourceUid: spirit.uid, ownerId: player.id, validTargets: opp.spirits.map((s) => s.uid), optional: false, pendingBattleAttackerUid: null };
      }
    },
  },

  // RSD05 — Thunder Dragon
  rsd05001Quill: {
    onDestroy(game, spirit, player) {
      const level = getCardLevel(spirit, CARD_POOL[spirit.cardId]);
      if (level < 2) return;
      const opp = game._opp(player);
      if (!opp.spirits.length) return;
      if (player.isAi) {
        const best = opp.spirits.sort((a, b) => getEffectiveBP(a, CARD_POOL[a.cardId]) - getEffectiveBP(b, CARD_POOL[b.cardId]))[0];
        game._bpDamage(opp, best.uid, 2000);
        game.addLog(`${spirit.name}: -2000 BP to ${best.name}.`);
      } else {
        game.awaitingEffect = { type: "bpDamage2000", label: "Quill: -2000 BP to opposing Spirit", sourceUid: spirit.uid, ownerId: player.id, validTargets: opp.spirits.map((s) => s.uid), optional: false, pendingBattleAttackerUid: null };
      }
    },
  },

  rsd05002Amaru: {
    onSummon(game, spirit, player) {
      const revealed = player.deck.splice(0, 3);
      const pick = revealed.find((id) => isThunderDragon(id) && CARD_POOL[id]?.type === "magic");
      const toHand = pick ? [pick] : [];
      const toBottom = pick ? revealed.filter((id) => id !== pick) : [...revealed];
      game.awaitingEffect = {
        type: "deckReveal", label: `${spirit.name}: Reveal`,
        sourceName: spirit.name, ownerId: player.id,
        revealed, toHand, toBottom, toTrash: [],
        validTargets: [], optional: false, pendingBattleAttackerUid: null,
      };
    },
  },

  rsd05003Raniraya: {
    onDestroy(game, spirit, player) {
      const opp = game._opp(player);
      if (!opp.spirits.length) return;
      if (player.isAi) {
        const best = opp.spirits.sort((a, b) => getEffectiveBP(a, CARD_POOL[a.cardId]) - getEffectiveBP(b, CARD_POOL[b.cardId]))[0];
        game._bpDamage(opp, best.uid, 2000);
        game.addLog(`${spirit.name}: -2000 BP to ${best.name}.`);
      } else {
        game.awaitingEffect = { type: "bpDamage2000", label: "Raniraya: -2000 BP to opposing Spirit", sourceUid: spirit.uid, ownerId: player.id, validTargets: opp.spirits.map((s) => s.uid), optional: false, pendingBattleAttackerUid: null };
      }
    },
  },

  rsd05004Divaes: {
    onAttack(game, spirit, player, level, attackerUid) {
      if (level < 2) return;
      const opp = game._opp(player);
      if (!opp.spirits.length) return;
      if (player.isAi) {
        const best = opp.spirits.sort((a, b) => getEffectiveBP(a, CARD_POOL[a.cardId]) - getEffectiveBP(b, CARD_POOL[b.cardId]))[0];
        game._bpDamage(opp, best.uid, 2000);
        game.addLog(`${spirit.name}: -2000 BP to ${best.name}.`);
      } else {
        game.awaitingEffect = { type: "bpDamage2000", label: "Divaes: -2000 BP to opposing Spirit", sourceUid: spirit.uid, ownerId: player.id, validTargets: opp.spirits.map((s) => s.uid), optional: false, pendingBattleAttackerUid: attackerUid };
      }
    },
  },

  rsd05006Semarogue: {
    onMagicPlay(game, spirit, player, level, magicCardId) {
      if (level < 2) return;
      if (!isThunderDragon(magicCardId)) return;
      draw(player, 1);
      game.addLog(`${spirit.name}: drew 1 card (Thunder Dragon Magic, True Release).`);
    },
    onAttack(game, spirit, player, _level, attackerUid) {
      const opp = game._opp(player);
      if (!opp.spirits.length) return;
      if (player.isAi) {
        const best = opp.spirits.sort((a, b) => getEffectiveBP(a, CARD_POOL[a.cardId]) - getEffectiveBP(b, CARD_POOL[b.cardId]))[0];
        game._bpDamage(opp, best.uid, 2000);
        game.addLog(`${spirit.name}: -2000 BP to ${best.name}.`);
      } else {
        game.awaitingEffect = { type: "bpDamage2000", label: "Semarogue: -2000 BP to opposing Spirit", sourceUid: spirit.uid, ownerId: player.id, validTargets: opp.spirits.map((s) => s.uid), optional: false, pendingBattleAttackerUid: attackerUid };
      }
    },
  },

  rsd05007TheSearchingThunderPelborg: {
    onSummon(game, spirit, player) {
      const revealed = player.deck.splice(0, 3);
      const pick = revealed.find((id) => isThunderDragon(id) && id !== "rsd05007TheSearchingThunderPelborg");
      if (pick) { player.hand.push(pick); player.deck.push(...revealed.filter((id) => id !== pick)); game.addLog(`${spirit.name}: added ${CARD_POOL[pick]?.name}.`); }
      else player.deck.push(...revealed);
    },
  },

  rsd05008TheCelestialThunderFistWigil: {
    onSummon(game, spirit, player) {
      const opp = game._opp(player);
      if (!opp.spirits.length) return;
      if (player.isAi) {
        const best = opp.spirits.sort((a, b) => getEffectiveBP(a, CARD_POOL[a.cardId]) - getEffectiveBP(b, CARD_POOL[b.cardId]))[0];
        game._bpDamage(opp, best.uid, 2000);
        game.addLog(`${spirit.name}: -2000 BP to ${best.name}.`);
      } else {
        game.awaitingEffect = { type: "bpDamage2000", label: "Wigil: -2000 BP to opposing Spirit", sourceUid: spirit.uid, ownerId: player.id, validTargets: opp.spirits.map((s) => s.uid), optional: true, pendingBattleAttackerUid: null };
      }
    },
    onAttack(game, spirit, player, level, attackerUid) {
      if (level < 2) return;
      const opp = game._opp(player);
      if (!opp.spirits.length) return;
      if (player.isAi) {
        const best = opp.spirits.sort((a, b) => getEffectiveBP(a, CARD_POOL[a.cardId]) - getEffectiveBP(b, CARD_POOL[b.cardId]))[0];
        game._bpDamage(opp, best.uid, 2000);
        game.addLog(`${spirit.name}: -2000 BP to ${best.name}.`);
      } else {
        game.awaitingEffect = { type: "bpDamage2000", label: "Wigil (True Release): -2000 BP to opposing Spirit", sourceUid: spirit.uid, ownerId: player.id, validTargets: opp.spirits.map((s) => s.uid), optional: true, pendingBattleAttackerUid: attackerUid };
      }
    },
  },

  rsd05X01TheEruptingThunderPalecoeurl: {
    onStartAttackStep(game, spirit, player, level) {
      if (level < 2) return;
      const opp = game._opp(player);
      [...opp.spirits].forEach((s) => { game._bpDamage(opp, s.uid, 2000); });
      game.addLog(`${spirit.name}: -2000 BP to all opposing Spirits.`);
    },
    onAttack(_game, spirit, _player, _level) {
      spirit._cantBeBlockedBPLimit = 4000;
    },
  },

  rsd05X02TheSpellThunderLucnas: {
    onSummon(game, spirit, player) {
      const opp = game._opp(player);
      if (!opp.spirits.length) return;
      if (player.isAi) {
        const best = opp.spirits.sort((a, b) => getEffectiveBP(a, CARD_POOL[a.cardId]) - getEffectiveBP(b, CARD_POOL[b.cardId]))[0];
        game._bpDamage(opp, best.uid, 4000);
        game.addLog(`${spirit.name}: -4000 BP to ${best.name}.`);
      } else {
        game.awaitingEffect = { type: "bpDamage4000", label: "Lucnas: -4000 BP to opposing Spirit", sourceUid: spirit.uid, ownerId: player.id, validTargets: opp.spirits.map((s) => s.uid), optional: false, pendingBattleAttackerUid: null };
      }
    },
    onAttack(game, spirit, player, level, attackerUid) {
      if (level < 2) return;
      const opp = game._opp(player);
      if (!opp.spirits.length) return;
      if (player.isAi) {
        const best = opp.spirits.sort((a, b) => getEffectiveBP(a, CARD_POOL[a.cardId]) - getEffectiveBP(b, CARD_POOL[b.cardId]))[0];
        game._bpDamage(opp, best.uid, 4000);
        game.addLog(`${spirit.name}: -4000 BP to ${best.name}.`);
      } else {
        game.awaitingEffect = { type: "bpDamage4000", label: "Lucnas (True Release): -4000 BP to opposing Spirit", sourceUid: spirit.uid, ownerId: player.id, validTargets: opp.spirits.map((s) => s.uid), optional: false, pendingBattleAttackerUid: attackerUid };
      }
    },
  },

  // RSD06 — Ferobeast
  rsd06001Nausa: {
    onDestroy(game, spirit, player) {
      const nx = player.nexuses[0];
      if (!nx) return;
      nx.cores.normal += 1;
      game.addLog(`${spirit.name}: core → ${nx.name}.`);
    },
  },

  rsd06002Deertora: {
    onSummon(game, spirit, player) {
      const revealed = player.deck.splice(0, 3);
      const pick = revealed.find((id) => isFerobeast(id) && CARD_POOL[id]?.type === "nexus");
      if (pick) { player.hand.push(pick); player.deck.push(...revealed.filter((id) => id !== pick)); game.addLog(`${spirit.name}: added ${CARD_POOL[pick]?.name}.`); }
      else player.deck.push(...revealed);
    },
  },

  rsd06003Melrak: {
    onDestroy(game, spirit, player) {
      const level = getCardLevel(spirit, CARD_POOL[spirit.cardId]);
      if (level < 2) return;
      const opp = game._opp(player);
      const targets = opp.spirits.filter((s) => (CARD_POOL[s.cardId]?.cost ?? 0) <= 3);
      if (!targets.length) return;
      game._effectOrAuto(player, targets, spirit.uid, null, "Melrak: Destroy opposing Cost ≤3 Spirit", false);
    },
  },

  rsd06006Svarris: {
    onSummon(game, spirit, player) {
      draw(player, 2);
      game.addLog(`${spirit.name}: drew 2 cards.`);
      const ret = player.hand.splice(-2, 2);
      player.deck.push(...ret);
      game.addLog(`${spirit.name}: returned 2 cards to deck.`);
    },
  },

  rsd06008TheTreeShadowFelio: {
    onSummon(game, spirit, player) {
      const n = player.nexuses.length;
      if (!n) return;
      spirit.bpBoost = (spirit.bpBoost ?? 0) + n * 1000;
      game.addLog(`${spirit.name}: +${n * 1000} BP (${n} Nexuses).`);
    },
  },

  rsd06X01TheShieldHornGigantherion: {
    onSummon(game, spirit, player) {
      const costLimit = player.nexuses.length >= 3 ? 6 : 4;
      const opp = game._opp(player);
      const targets = opp.spirits.filter((s) => (CARD_POOL[s.cardId]?.cost ?? 0) <= costLimit);
      if (!targets.length) return;
      game._effectOrAuto(player, targets, spirit.uid, null, `Gigantherion: Destroy opposing Cost ≤${costLimit} Spirit`, false);
    },
    onAttack(game, spirit, _player, level) {
      if (level < 2) return;
      spirit._requiresOpponentExhaustToBlock = true;
      game.addLog(`${spirit.name}: opponent must exhaust to block.`);
    },
  },

  rsd06X02TheExtremeTreeElepheas: {
    onAttack(_game, spirit, _player, level) {
      if (level < 2) return;
      spirit._bonusLifeReduction = true;
    },
  },

  // ==================== RSD02-05 NEXUS EFFECTS ====================

  rsd02010TheVioletWitherlands: {
    onDeploy(game, nexus, player) {
      const opp = game._opp(player);
      if (!opp.spirits.length) return;
      const targets = opp.spirits.filter((s) => s.cores.normal > 0 && !s._magicImmune);
      if (!targets.length) return;
      if (player.isAi) {
        const t = targets[0];
        opp.reserve.normal += 1;
        t.cores.normal -= 1;
        game.addLog(`${nexus.name}: sent 1 core from ${t.name} to Reserve.`);
      } else {
        game.awaitingEffect = {
          type: "violetWitherlandsSendCore",
          label: `${nexus.name}: Send 1 core from opposing Spirit to Reserve`,
          sourceUid: nexus.uid,
          ownerId: player.id,
          validTargets: targets.map((s) => s.uid),
          optional: false,
          pendingBattleAttackerUid: null,
        };
      }
    },
  },

  rsd03010UtmostDepthTheEmeraldAbyss: {
    onAttackStepOwnSpirit(game, nexus, player, level, spirit) {
      if (level >= 1 && isArmoredFish(spirit.cardId)) {
        spirit.bpBoost = (spirit.bpBoost ?? 0) + 1000;
      }
    },
  },

  rsd03011TheBubbleClusterRealm: {
    onDeploy(game, nexus, player) {
      const opp = game._opp(player);
      if (!opp.spirits.length) return;
      const targets = opp.spirits.filter((s) => !s.exhausted && !s._magicImmune);
      if (!targets.length) return;
      if (player.isAi) {
        const t = targets[0];
        t.exhausted = true;
        game.addLog(`${nexus.name}: exhausted ${t.name}.`);
      } else {
        game.awaitingEffect = {
          type: "bubbleClusterExhaust",
          label: `${nexus.name}: Exhaust target opposing Spirit`,
          sourceUid: nexus.uid,
          ownerId: player.id,
          validTargets: targets.map((s) => s.uid),
          optional: false,
          pendingBattleAttackerUid: null,
        };
      }
    },
    onMainStep(game, nexus, player, level) {
      if (level < 2) return;
      const exhaustedArmoredFish = player.spirits.filter((s) => isArmoredFish(s.cardId) && s.exhausted).length;
      if (exhaustedArmoredFish >= 2 && player.voidCore > 0) {
        player.voidCore -= 1;
        player.reserve.normal += 1;
        game.addLog(`${nexus.name}: added 1 core from Void to Reserve.`);
      }
    },
  },

  rsd04009TheQuarryPlain: {
    onEndStep(game, nexus, player, level) {
      if (level < 2) return;
      const mineroidSpirits = player.spirits.filter((s) => isMineroid(s.cardId));
      if (!mineroidSpirits.length) return;
      if (player.isAi) {
        mineroidSpirits[0].exhausted = false;
      } else {
        game.awaitingEffect = {
          type: "quarryPlainRefresh",
          label: `${nexus.name}: Refresh target Mineroid Spirit`,
          sourceUid: nexus.uid,
          ownerId: player.id,
          validTargets: mineroidSpirits.map((s) => s.uid),
          optional: true,
          pendingBattleAttackerUid: null,
        };
      }
    },
  },

  rsd04010UtmostDepthTheWhiteHeavenPlain: {
    // Opposing Attack Step BP boost handled elsewhere
  },

  rsd04011TheMenhirCircle: {
    onDeploy(game, nexus, player) {
      if (player.hand.length === 0) {
        game.addLog(`${nexus.name}: no cards in hand.`);
        return;
      }
      const whiteMineroidsInHand = player.hand.filter((id) => isMineroid(id) && CARD_POOL[id]?.color === "white");
      if (whiteMineroidsInHand.length === 0) {
        game.addLog(`${nexus.name}: no White Mineroid cards in hand.`);
        return;
      }
      if (player.isAi) {
        const toReturn = whiteMineroidsInHand.slice(0, 2);
        toReturn.forEach((id) => {
          const idx = player.hand.indexOf(id);
          if (idx >= 0) player.hand.splice(idx, 1);
          player.deck.push(id);
        });
        const drawn = player.deck.splice(0, toReturn.length);
        player.hand.push(...drawn);
        game.addLog(`${nexus.name}: returned ${toReturn.length} White Mineroid card(s), drew ${toReturn.length}.`);
      } else {
        game.awaitingEffect = {
          type: "menhirCircleSelectCards",
          label: `${nexus.name}: Select up to 2 White Mineroid cards to return to deck bottom`,
          sourceUid: nexus.uid,
          ownerId: player.id,
          validTargets: whiteMineroidsInHand,
          optional: true,
          pendingBattleAttackerUid: null,
        };
      }
    },
  },

  rsd05009TheThunderDriftways: {
    // Your Attack Step: Thunder Dragon can't be blocked by 1000 BP or less - handled in battle resolution
  },

  rsd05010UtmostDepthThePeaksOfGreatThunderMountain: {
    // Opposing Attack Step: Symbols reduction handled elsewhere
    // LV2 True Release: Draw when destroy 0 BP via spirit effect - tracked in spirit destruction
  },

  rsd06009TheMistyForest: {
    onEndStep(game, nexus, player, level) {
      if (level < 2) return;
      const nexusCount = player.nexuses.length;
      const refreshCount = Math.floor(nexusCount / 2);
      if (refreshCount === 0) return;
      const ferobeastSpirits = player.spirits.filter((s) => isFerobeast(s.cardId));
      if (ferobeastSpirits.length === 0) return;
      if (player.isAi) {
        for (let i = 0; i < Math.min(refreshCount, ferobeastSpirits.length); i++) {
          ferobeastSpirits[i].exhausted = false;
        }
        game.addLog(`${nexus.name}: refreshed up to ${refreshCount} Ferobeast Spirit(s).`);
      } else {
        const targets = Array.from({ length: refreshCount }, () => ferobeastSpirits).flat().filter((_, i) => i < refreshCount * ferobeastSpirits.length);
        game.awaitingEffect = {
          type: "mistyForestRefresh",
          label: `${nexus.name}: Select up to ${refreshCount} Ferobeast Spirits to refresh`,
          sourceUid: nexus.uid,
          ownerId: player.id,
          validTargets: ferobeastSpirits.map((s) => s.uid),
          optional: true,
          pendingBattleAttackerUid: null,
        };
      }
    },
  },

  rsd06010UtmostDepthTheExtremeGiantTree: {
    onDeploy(game, nexus, player) {
      const blueNexusCount = player.nexuses.filter((n) => CARD_POOL[n.cardId]?.color === "blue").length;
      if (blueNexusCount >= 3 && !nexus._extraSymbol) {
        nexus._extraSymbol = true;
        game.addLog(`${nexus.name}: gained an extra Blue symbol.`);
      }
    },
  },

  rsd06011TheBarrageForest: {
    onDeploy(game, nexus, player) {
      const opp = game._opp(player);
      const targets = opp.spirits.filter((s) => (CARD_POOL[s.cardId]?.cost ?? 0) <= 3 && !s._magicImmune);
      if (!targets.length) return;
      if (player.isAi) {
        const t = targets[0];
        game.destroySpirit(opp, t.uid);
      } else {
        game.awaitingEffect = {
          type: "barrageForestDestroy",
          label: `${nexus.name}: Destroy target opposing Cost 3 or less Spirit`,
          sourceUid: nexus.uid,
          ownerId: player.id,
          validTargets: targets.map((s) => s.uid),
          optional: false,
          pendingBattleAttackerUid: null,
        };
      }
    },
  },

  // ==================== RBS01 — Red ====================

  rbs01001Petristar: {
    onDestroy(game, spirit, player) {
      const opp = game._opp(player);
      const targets = opp.spirits.filter((s) => getEffectiveBP(s, CARD_POOL[s.cardId]) <= 4000);
      if (!targets.length) return;
      game._effectOrAuto(player, targets, spirit.uid, null, `${spirit.name}: Destroy opposing ≤4000 BP Spirit`, false);
    },
  },

  rbs01002SunSpawn: {
    onAttack(_game, spirit, _player, _level) {
      spirit._clashActive = true;
    },
  },

  rbs01003ScudBeast: {},

  rbs01004Kukulakatol: {
    onSummon(game, spirit, player) {
      const idx = player.trash.findIndex((id) => hasClash(id) && CARD_POOL[id]?.type === "spirit");
      if (idx < 0) return;
      const [id] = player.trash.splice(idx, 1);
      player.hand.push(id);
      game.addLog(`${spirit.name}: ${CARD_POOL[id]?.name} returned from Trash.`);
    },
  },

  rbs01005Pergasos: {
    onAttack(_game, spirit, _player, level) {
      if (level < 2) return;
      spirit._clashActive = true;
    },
  },

  rbs01006Pawgriffo: {
    onAttack(game, spirit, player, level) {
      spirit._clashActive = true;
      if (level < 2) return;
      draw(player, 1);
      game.addLog(`${spirit.name}: drew 1 card.`);
    },
  },

  rbs01007Glitail: {
    onDestroy(game, spirit, player) {
      const myBP = CARD_POOL[spirit.cardId]?.levels?.find((l) => l.level === 1)?.bp ?? 0;
      const opp = game._opp(player);
      const target = opp.spirits.find((s) => getEffectiveBP(s, CARD_POOL[s.cardId]) === myBP);
      if (!target) return;
      game.destroySpirit(opp, target.uid);
      game.addLog(`${spirit.name}: destroyed ${target.name} (same BP).`);
    },
    onAttack(_game, spirit, _player, level) {
      if (level < 2) return;
      spirit._clashActive = true;
    },
  },

  rbs01008Cockadrice: {
    onSummon(game, spirit, player) {
      const clashCount = player.spirits.filter((s) => hasClash(s.cardId) && s.uid !== spirit.uid).length;
      const bpLimit = 3000 + clashCount * 1000;
      const opp = game._opp(player);
      const targets = opp.spirits.filter((s) => getEffectiveBP(s, CARD_POOL[s.cardId]) <= bpLimit);
      if (!targets.length) return;
      game._effectOrAuto(player, targets, spirit.uid, null, `${spirit.name}: Destroy ≤${bpLimit} BP Spirit`, false);
    },
  },

  rbs01009TheRedGuideShaniel: {
    onAttack(_game, spirit, _player) {
      spirit._clashActive = true;
    },
    onStartAttackStep(game, spirit, player, level) {
      if (level < 2) return;
      player.spirits.filter((s) => hasClash(s.cardId)).forEach((s) => {
        s.bpBoost = (s.bpBoost ?? 0) + 2000;
        game.addLog(`${spirit.name}: ${s.name} +2000 BP.`);
      });
    },
  },

  rbs01010TheFlyingDauntlessFalconiforme: {
    onSummon(game, spirit, player) {
      const hasExhWF = player.spirits.some((s) => isWindfang(s.cardId) && s.exhausted && s.uid !== spirit.uid);
      const bpLimit = hasExhWF ? 5000 : 3000;
      const opp = game._opp(player);
      const targets = opp.spirits.filter((s) => getEffectiveBP(s, CARD_POOL[s.cardId]) <= bpLimit);
      if (!targets.length) return;
      game._effectOrAuto(player, targets, spirit.uid, null, `${spirit.name}: Destroy opposing ≤${bpLimit} BP`, false);
    },
  },

  rbs01011GinoAnkh: {
    onSummon(game, spirit, player) {
      const opp = game._opp(player);
      if (!opp.nexuses.length) return;
      if (player.isAi) {
        const nx = opp.nexuses[0];
        game._destroyNexus(opp, nx.uid);
        game.addLog(`${spirit.name}: destroyed ${nx.name}.`);
      } else {
        game.awaitingEffect = {
          type: "destroyNexus", label: `${spirit.name}: Destroy opposing Nexus`,
          sourceUid: spirit.uid, ownerId: player.id, validTargets: opp.nexuses.map((n) => n.uid),
          optional: false, pendingBattleAttackerUid: null,
        };
      }
    },
  },

  rbs01012Regulinaz: {},   // Invoke Flash in INVOKE_FLASH_HANDLERS; Legacy skipped

  rbs01013Thorel: {
    onAttack(_game, spirit, _player) {
      spirit._clashActive = true;
    },
    // LV2 True Release: when life reduced, send 3 cores from Trash to Clash spirits
    onAttackWin(_game, _spirit, _player, level) {
      if (level < 2) return;
      // Only triggers when attack hits life (no blocker)
    },
  },

  rbs01014TheDragonSteedRostache: {
    onSummon(game, spirit, player) {
      const idx = player.trash.findIndex((id) => CARD_POOL[id]?.type === "spirit" && CARD_POOL[id]?.color === "red" && (CARD_POOL[id]?.cost ?? 0) <= 5);
      if (idx < 0) return;
      if (player.isAi) {
        const [id] = player.trash.splice(idx, 1);
        player.hand.push(id);
        game.addLog(`${spirit.name}: ${CARD_POOL[id]?.name} returned from Trash.`);
      } else {
        const targets = player.trash.filter((id) => CARD_POOL[id]?.type === "spirit" && CARD_POOL[id]?.color === "red" && (CARD_POOL[id]?.cost ?? 0) <= 5);
        if (!targets.length) return;
        game.awaitingEffect = { type: "returnCardFromTrash", label: `${spirit.name}: Return Cost≤5 Red Spirit from Trash`, sourceUid: spirit.uid, ownerId: player.id, validTargets: targets, optional: false, pendingBattleAttackerUid: null };
      }
    },
    onAttack(game, spirit, player, level) {
      if (level < 2) return;
      const opp = game._opp(player);
      const targets = opp.spirits.filter((s) => getEffectiveBP(s, CARD_POOL[s.cardId]) <= 3000);
      if (!targets.length) return;
      game._effectOrAuto(player, targets, spirit.uid, null, `${spirit.name}: Destroy ≤3000 BP Spirit`, false);
    },
  },

  rbs01015Protomaia: {
    onAttack(_game, spirit, _player, level) {
      if (level < 2) return;
      spirit._clashActive = true;
    },
  },

  rbs01X01TheRedWitchRestiel: {
    onSummon(game, spirit, player) {
      const revealed = player.deck.splice(0, 3);
      const pick = revealed.find((id) => hasClash(id) && CARD_POOL[id]?.type === "spirit");
      const toHand = pick ? [pick] : [];
      const toBottom = pick ? revealed.filter((id) => id !== pick) : [...revealed];
      game.awaitingEffect = {
        type: "deckReveal", label: `${spirit.name}: Reveal`,
        sourceName: spirit.name, ownerId: player.id,
        revealed, toHand, toBottom, toTrash: [],
        validTargets: [], optional: false, pendingBattleAttackerUid: null,
      };
    },
    // LV2 True Release Invoke Flash in INVOKE_FLASH_HANDLERS
  },

  rbs01X02TheSixVermilionCarneliath: {
    onSummon(game, spirit, player) {
      const opp = game._opp(player);
      const under3k = opp.spirits.filter((s) => getEffectiveBP(s, CARD_POOL[s.cardId]) <= 3000);
      const under5k = opp.spirits.filter((s) => getEffectiveBP(s, CARD_POOL[s.cardId]) <= 5000);
      if (player.isAi) {
        // Prefer destroying two ≤3000 if possible
        if (under3k.length >= 2) {
          [0, 1].forEach((i) => game.destroySpirit(opp, under3k[i].uid));
          game.addLog(`${spirit.name}: destroyed 2 Spirits ≤3000 BP.`);
        } else if (under5k.length) {
          const best = under5k.sort((a, b) => getEffectiveBP(b, CARD_POOL[b.cardId]) - getEffectiveBP(a, CARD_POOL[a.cardId]))[0];
          game.destroySpirit(opp, best.uid);
          game.addLog(`${spirit.name}: destroyed 1 Spirit ≤5000 BP.`);
        }
      } else if (under3k.length || under5k.length) {
        // Human picks mode first — simplified: auto-resolve by AI logic for now
        if (under3k.length >= 2) {
          [0, 1].forEach((i) => game.destroySpirit(opp, under3k[i].uid));
          game.addLog(`${spirit.name}: destroyed 2 Spirits ≤3000 BP.`);
        } else if (under5k.length) {
          game.awaitingEffect = { type: "destroySpirit", label: `${spirit.name}: Destroy ≤5000 BP Spirit`, sourceUid: spirit.uid, ownerId: player.id, validTargets: under5k.map((s) => s.uid), optional: false, pendingBattleAttackerUid: null };
        }
      }
    },
  },

  rbs01X03TheRoaringWindValdigeyer: {
    onAttack(_game, spirit) {
      spirit._clashActive = true;
    },
    onAttackWin(game, spirit, _player, level) {
      if (level < 2) return;
      if ((spirit._prevBlockerBP ?? Infinity) <= 5000) {
        spirit.exhausted = false;
        game.addLog(`${spirit.name}: refreshed (blocked by ≤5000 BP).`);
      }
    },
  },

  // ---- RBS01 Purple ----

  rbs01016Bonrat: {
    onDestroy(game, spirit, player, level) {
      if (level < 2) return;
      const opp = game._opp(player);
      const targets = opp.spirits.filter((s) => s.exhausted && (CARD_POOL[s.cardId]?.cost ?? 0) <= 3);
      if (!targets.length) return;
      game._effectOrAuto(player, targets, spirit.uid, null, `${spirit.name}: Destroy Cost≤3 exhausted Spirit`, true);
    },
  },

  rbs01017Imseid: {
    onDestroy(game, spirit, player) {
      const t = player.spirits.find((s) => hasShamanism(s.cardId) && s.uid !== spirit.uid);
      if (!t) return;
      t.bpBoost = (t.bpBoost ?? 0) + 3000;
      game.addLog(`${spirit.name}: ${t.name} +3000 BP.`);
    },
  },

  rbs01018DeadLaika: {
    onAttack(game, spirit, player) {
      if (!player.spirits.some((s) => hasShamanism(s.cardId) && s.uid !== spirit.uid)) return;
      spirit.bpBoost = (spirit.bpBoost ?? 0) + 2000;
      game.addLog(`${spirit.name}: +2000 BP (own Shamanism).`);
    },
    onDestroy(game, spirit, player, level) {
      if (level < 2) return;
      draw(player, 1);
      game.addLog(`${spirit.name}: drew 1 card.`);
    },
  },

  rbs01019Bullkleiten: {},

  rbs01020Odonatta: {
    onAttack(game, spirit) {
      spirit.bpBoost = (spirit.bpBoost ?? 0) + 2000;
      game.addLog(`${spirit.name}: +2000 BP.`);
    },
  },

  rbs01021Spectrous: {
    onSummon(game, spirit, player) {
      const valid = player.trash.filter((id) => isDarkPuce(id) && CARD_POOL[id]?.type === "spirit" && (CARD_POOL[id]?.cost ?? 0) <= 2);
      if (!valid.length) return;
      if (player.isAi) {
        const pick = [...valid].sort((a, b) => (CARD_POOL[b]?.cost ?? 0) - (CARD_POOL[a]?.cost ?? 0))[0];
        const idx = player.trash.indexOf(pick);
        player.trash.splice(idx, 1);
        const s = makeSpiritFromCard(pick, player.id, game.turnNumber);
        player.spirits.push(s);
        game.addLog(`${spirit.name}: Shamanism – ${CARD_POOL[pick]?.name} summoned.`);
        CARD_EFFECTS[pick]?.onSummon?.(game, s, player);
      } else {
        game.awaitingEffect = { type: "summonFromTrash", label: `${spirit.name}: Shamanism – Summon Dark Puce ≤2 from Trash`, sourceUid: spirit.uid, ownerId: player.id, validTargets: valid, optional: true, pendingBattleAttackerUid: null };
      }
    },
    onAttack(game, spirit, _player, level) {
      if (level < 2) return;
      spirit.bpBoost = (spirit.bpBoost ?? 0) + 2000;
      game.addLog(`${spirit.name}: +2000 BP.`);
    },
  },

  rbs01022Centicade: {
    onStartAttackStep(game, spirit, player) {
      player.spirits.filter((s) => hasShamanism(s.cardId)).forEach((s) => {
        s.bpBoost = (s.bpBoost ?? 0) + 1000;
        game.addLog(`${spirit.name}: ${s.name} +1000 BP.`);
      });
    },
  },

  rbs01023TheVioletScreechDracuroar: {
    onAttack(game, spirit, player, level, attackerUid) {
      if (level < 2) return;
      const opp = game._opp(player);
      const targets = opp.spirits.filter((s) => (CARD_POOL[s.cardId]?.cost ?? 0) <= 5);
      if (!targets.length) return;
      if (player.isAi) {
        const best = targets.sort((a, b) => b.cores.normal - a.cores.normal)[0];
        game._drainToOne(opp, best.uid);
        game.addLog(`${spirit.name}: ${best.name} drained to 1 core.`);
      } else {
        game.awaitingEffect = { type: "drainToOne", label: `${spirit.name}: Drain Cost≤5 Spirit to 1 core`, sourceUid: spirit.uid, ownerId: player.id, validTargets: targets.map((t) => t.uid), optional: false, pendingBattleAttackerUid: attackerUid };
      }
    },
  },

  rbs01024TheSpyButterflyPapilioni: {
    onSummon(game, spirit, player) {
      const valid = player.trash.filter((id) => isDarkPuce(id) && CARD_POOL[id]?.type === "spirit" && (CARD_POOL[id]?.cost ?? 0) <= 3);
      if (!valid.length) return;
      if (player.isAi) {
        const pick = [...valid].sort((a, b) => (CARD_POOL[b]?.cost ?? 0) - (CARD_POOL[a]?.cost ?? 0))[0];
        const idx = player.trash.indexOf(pick);
        player.trash.splice(idx, 1);
        const s = makeSpiritFromCard(pick, player.id, game.turnNumber);
        player.spirits.push(s);
        game.addLog(`${spirit.name}: Shamanism – ${CARD_POOL[pick]?.name} summoned.`);
        CARD_EFFECTS[pick]?.onSummon?.(game, s, player);
      } else {
        game.awaitingEffect = { type: "summonFromTrash", label: `${spirit.name}: Shamanism – Summon Dark Puce ≤3 from Trash`, sourceUid: spirit.uid, ownerId: player.id, validTargets: valid, optional: true, pendingBattleAttackerUid: null };
      }
    },
    onAttack(game, spirit, player, level, attackerUid) {
      if (level < 2) return;
      const opp = game._opp(player);
      const targets = opp.spirits.filter((s) => s.exhausted && (CARD_POOL[s.cardId]?.cost ?? 0) <= 3);
      if (!targets.length) return;
      game._effectOrAuto(player, targets, spirit.uid, attackerUid, `${spirit.name}: Destroy exhausted Cost≤3 Spirit`, false);
    },
  },

  rbs01025DullaCoshta: {
    onSummon(game, spirit, player) {
      const valid = player.trash.filter((id) => isDarkPuce(id) && CARD_POOL[id]?.type === "spirit" && (CARD_POOL[id]?.cost ?? 0) <= 3);
      if (!valid.length) return;
      if (player.isAi) {
        const pick = [...valid].sort((a, b) => (CARD_POOL[b]?.cost ?? 0) - (CARD_POOL[a]?.cost ?? 0))[0];
        const idx = player.trash.indexOf(pick);
        player.trash.splice(idx, 1);
        const s = makeSpiritFromCard(pick, player.id, game.turnNumber);
        player.spirits.push(s);
        game.addLog(`${spirit.name}: Shamanism – ${CARD_POOL[pick]?.name} summoned.`);
        CARD_EFFECTS[pick]?.onSummon?.(game, s, player);
      } else {
        game.awaitingEffect = { type: "summonFromTrash", label: `${spirit.name}: Shamanism – Summon Dark Puce ≤3 from Trash`, sourceUid: spirit.uid, ownerId: player.id, validTargets: valid, optional: true, pendingBattleAttackerUid: null };
      }
    },
    onDestroy(game, spirit, player, level) {
      if (level < 2) return;
      const opp = game._opp(player);
      const targets = opp.spirits.filter((s) => s.cores.normal > 0);
      if (!targets.length) return;
      if (player.isAi) {
        const best = targets.sort((a, b) => b.cores.normal - a.cores.normal)[0];
        game._sendCores(opp, best.uid, 1);
        game.addLog(`${spirit.name}: sent 1 core from ${best.name}.`);
      } else {
        game.awaitingEffect = { type: "sendCoreFromSpirit", label: `${spirit.name}: Send core from opposing Spirit`, sourceUid: spirit.uid, ownerId: player.id, validTargets: targets.map((t) => t.uid), optional: false, pendingBattleAttackerUid: null };
      }
    },
  },

  rbs01026BorzoInu: {
    onSummon(game, spirit, player) {
      const bonus = player._depletedOpponentThisTurn ? 2 : 1;
      draw(player, bonus);
      game.addLog(`${spirit.name}: drew ${bonus} card${bonus > 1 ? "s" : ""}.`);
    },
  },

  // rbs01027LebenLeichnam uses INVOKE_MAIN_HANDLERS

  rbs01028TheMysticPurpleBaphomendes: {
    onSummon(game, spirit, player) {
      const shamanCount = player.spirits.filter((s) => hasShamanism(s.cardId) && s.uid !== spirit.uid).length;
      const n = 1 + shamanCount;
      const opp = game._opp(player);
      const targets = opp.spirits.filter((s) => s.cores.normal > 0);
      if (!targets.length) return;
      // Send cores spread across targets
      let remaining = n;
      for (const t of [...targets].sort((a, b) => b.cores.normal - a.cores.normal)) {
        if (remaining <= 0) break;
        const send = Math.min(t.cores.normal, remaining);
        game._sendCores(opp, t.uid, send);
        remaining -= send;
      }
      game.addLog(`${spirit.name}: sent ${n} core${n !== 1 ? "s" : ""} from opposing Spirits.`);
    },
    onDestroy(game, spirit, player, level) {
      if (level < 2) return;
      const shamanCount = player.spirits.filter((s) => hasShamanism(s.cardId)).length;
      if (!shamanCount) return;
      draw(player, shamanCount);
      game.addLog(`${spirit.name}: drew ${shamanCount} card${shamanCount !== 1 ? "s" : ""}.`);
    },
  },

  rbs01029Beelzeret: {
    onSummon(game, spirit, player) {
      const opp = game._opp(player);
      const targets = opp.spirits.filter((s) => s.cores.normal > 0);
      if (!targets.length) return;
      if (player.isAi) {
        const best = targets.sort((a, b) => b.cores.normal - a.cores.normal)[0];
        game._sendCores(opp, best.uid, 1);
        game.addLog(`${spirit.name}: sent 1 core from ${best.name}.`);
      } else {
        game.awaitingEffect = { type: "sendCoreFromSpirit", label: `${spirit.name}: Send core from opposing Spirit`, sourceUid: spirit.uid, ownerId: player.id, validTargets: targets.map((t) => t.uid), optional: false, pendingBattleAttackerUid: null };
      }
    },
  },

  rbs01030TheDancingFoxCharlesDepeta: {
    onSummon(game, spirit, player) {
      const valid = player.trash.filter((id) => isDarkPuce(id) && CARD_POOL[id]?.type === "spirit" && (CARD_POOL[id]?.cost ?? 0) <= 7);
      if (!valid.length) return;
      if (player.isAi) {
        const pick = [...valid].sort((a, b) => (CARD_POOL[b]?.cost ?? 0) - (CARD_POOL[a]?.cost ?? 0))[0];
        const idx = player.trash.indexOf(pick);
        player.trash.splice(idx, 1);
        const s = makeSpiritFromCard(pick, player.id, game.turnNumber);
        player.spirits.push(s);
        game.addLog(`${spirit.name}: Shamanism – ${CARD_POOL[pick]?.name} summoned.`);
        CARD_EFFECTS[pick]?.onSummon?.(game, s, player);
      } else {
        game.awaitingEffect = { type: "summonFromTrash", label: `${spirit.name}: Shamanism – Summon Dark Puce ≤7 from Trash`, sourceUid: spirit.uid, ownerId: player.id, validTargets: valid, optional: true, pendingBattleAttackerUid: null };
      }
    },
  },

  rbs01X04TheInsectLordShiReizen: {
    onSummon(game, spirit, player) {
      const revealed = player.deck.splice(0, 3);
      const purpleIdx = revealed.findIndex((id) => CARD_POOL[id]?.color === "purple");
      if (purpleIdx >= 0) {
        const [disc] = revealed.splice(purpleIdx, 1);
        player.trash.push(disc);
        game.addLog(`${spirit.name}: discarded ${CARD_POOL[disc]?.name}.`);
      }
      player.deck.push(...revealed);
    },
    onAttack(game, spirit, player, level) {
      if (level < 2) return;
      // Activate Shamanism of a target own Shamanism spirit — auto-pick for AI, skip for human complexity
      const target = player.spirits.find((s) => hasShamanism(s.cardId) && s.uid !== spirit.uid);
      if (!target) return;
      game.addLog(`${spirit.name}: activating Shamanism of ${target.name}.`);
      CARD_EFFECTS[target.cardId]?.onSummon?.(game, target, player);
    },
  },

  rbs01X05QueenBabianaros: {
    onSummon(game, spirit, player) {
      const valid = player.trash.filter((id) => isDarkPuce(id) && CARD_POOL[id]?.type === "spirit" && (CARD_POOL[id]?.cost ?? 0) <= 5);
      if (!valid.length) return;
      if (player.isAi) {
        const pick = [...valid].sort((a, b) => (CARD_POOL[b]?.cost ?? 0) - (CARD_POOL[a]?.cost ?? 0))[0];
        const idx = player.trash.indexOf(pick);
        player.trash.splice(idx, 1);
        const s = makeSpiritFromCard(pick, player.id, game.turnNumber);
        player.spirits.push(s);
        game.addLog(`${spirit.name}: Shamanism – ${CARD_POOL[pick]?.name} summoned.`);
        CARD_EFFECTS[pick]?.onSummon?.(game, s, player);
      } else {
        game.awaitingEffect = { type: "summonFromTrash", label: `${spirit.name}: Shamanism – Summon Dark Puce ≤5 from Trash`, sourceUid: spirit.uid, ownerId: player.id, validTargets: valid, optional: true, pendingBattleAttackerUid: null };
      }
    },
    onAttack(game, spirit, player, level, attackerUid) {
      if (level < 2) return;
      const shamanCount = player.spirits.filter((s) => hasShamanism(s.cardId)).length;
      if (!shamanCount) return;
      const opp = game._opp(player);
      const targets = opp.spirits.filter((s) => (CARD_POOL[s.cardId]?.cost ?? 0) <= 5);
      if (!targets.length) return;
      if (player.isAi) {
        const best = targets.sort((a, b) => b.cores.normal - a.cores.normal)[0];
        game._sendCores(opp, best.uid, shamanCount);
        game.addLog(`${spirit.name}: sent ${shamanCount} cores from ${best.name}.`);
      } else {
        game.awaitingEffect = { type: "sendCoreFromSpirit", label: `${spirit.name}: Send ${shamanCount} cores from Cost≤5 Spirit`, sourceUid: spirit.uid, ownerId: player.id, validTargets: targets.map((t) => t.uid), optional: false, pendingBattleAttackerUid: attackerUid };
      }
    },
  },

  rbs01X06DukeDunpillion: {
    onSummon(game, spirit, player) {
      const opp = game._opp(player);
      const targets = opp.spirits.filter((s) => s.cores.normal > 0).slice(0, 3);
      targets.forEach((t) => {
        game._sendCores(opp, t.uid, 1);
      });
      if (targets.length) game.addLog(`${spirit.name}: sent 1 core from ${targets.length} opposing Spirit${targets.length !== 1 ? "s" : ""}.`);
    },
    onAttack(game, spirit, player, level) {
      if (level < 2) return;
      if (!player._depletedOpponentThisTurn) return;
      spirit._bonusLifeReduction = true;
      game.addLog(`${spirit.name}: bonus life reduction (opponent depleted this turn).`);
    },
  },

  // ---- RBS01 Green ----

  rbs01031Harshee: {
    onSummon(_game, spirit) { spirit._cantAttackAtLV1 = true; },
  },

  rbs01032Regatracus: {
    onAttack(game, spirit, _player, level) {
      if (level < 2) return;
      spirit.bpBoost = (spirit.bpBoost ?? 0) + 2000;
      game.addLog(`${spirit.name}: +2000 BP.`);
    },
  },

  rbs01033Kurapora: {
    onDestroy(game, spirit, player) {
      const opp = game._opp(player);
      const targets = opp.spirits.filter((s) => (CARD_POOL[s.cardId]?.cost ?? 0) <= 5);
      if (!targets.length) return;
      if (player.isAi) {
        const best = targets.sort((a, b) => getEffectiveBP(b, CARD_POOL[b.cardId]) - getEffectiveBP(a, CARD_POOL[a.cardId]))[0];
        best.exhausted = true;
        game.addLog(`${spirit.name}: exhausted ${best.name}.`);
      } else {
        game.awaitingEffect = { type: "exhaustSpirit", label: `${spirit.name}: Exhaust opposing Cost≤5 Spirit`, sourceUid: spirit.uid, ownerId: player.id, validTargets: targets.map((t) => t.uid), optional: true, pendingBattleAttackerUid: null };
      }
    },
  },

  rbs01034Salakka: {
    onSummon(game, spirit, player) {
      const hasCurrentSpirit = player.spirits.some((s) => hasCurrent(s.cardId) && s.uid !== spirit.uid);
      if (hasCurrentSpirit) {
        spirit.cores.normal += 1;
        game.addLog(`${spirit.name}: core from Void → self (Current spirit present).`);
      } else {
        player.trashCore.normal += 1;
        game.addLog(`${spirit.name}: core from Void → Trash.`);
      }
    },
  },

  // rbs01035Alotoll: Current Invoke Flash in INVOKE_FLASH_HANDLERS

  rbs01036TheImmatureNereIro: {
    onAttackWin(game, spirit, player, level) {
      if (level < 2) return;
      const opp = game._opp(player);
      const targets = opp.spirits.filter((s) => !s.exhausted);
      if (!targets.length) return;
      if (player.isAi) {
        const best = targets.sort((a, b) => getEffectiveBP(b, CARD_POOL[b.cardId]) - getEffectiveBP(a, CARD_POOL[a.cardId]))[0];
        best.exhausted = true;
        game.addLog(`${spirit.name}: exhausted ${best.name}.`);
      } else {
        game.awaitingEffect = { type: "exhaustSpirit", label: `${spirit.name}: Exhaust opposing Spirit`, sourceUid: spirit.uid, ownerId: player.id, validTargets: targets.map((t) => t.uid), optional: true, pendingBattleAttackerUid: null };
      }
    },
  },

  rbs01037Waltar: {
    onBlock(game, spirit) {
      spirit.bpBoost = (spirit.bpBoost ?? 0) + 2000;
      game.addLog(`${spirit.name}: +2000 BP (blocking).`);
    },
    onEndStep(game, spirit, player, level) {
      if (level < 2) return;
      const target = player.spirits.find((s) => hasCurrent(s.cardId) && s.exhausted);
      if (!target) return;
      target.exhausted = false;
      game.addLog(`${spirit.name}: refreshed ${target.name} (Current).`);
    },
  },

  // rbs01038Gaviadile: Current Invoke Flash in INVOKE_FLASH_HANDLERS + onBlock LV2 below

  rbs01038Gaviadile: {
    onBlock(game, spirit, _player, level) {
      if (level < 2) return;
      spirit.bpBoost = (spirit.bpBoost ?? 0) + 2000;
      game.addLog(`${spirit.name}: +2000 BP (True Release, blocking).`);
    },
  },

  rbs01039Hammergrau: {
    onAttack(game, spirit, player, level, attackerUid) {
      if (level < 2) return;
      const opp = game._opp(player);
      const targets = opp.spirits.filter((s) => !s.cores.soul);
      if (!targets.length) return;
      if (player.isAi) {
        const best = targets.sort((a, b) => getEffectiveBP(b, CARD_POOL[b.cardId]) - getEffectiveBP(a, CARD_POOL[a.cardId]))[0];
        best.exhausted = true;
        game.addLog(`${spirit.name}: exhausted ${best.name} (no Soul Core).`);
      } else {
        game.awaitingEffect = { type: "exhaustSpirit", label: `${spirit.name}: Exhaust opposing Spirit without Soul Core`, sourceUid: spirit.uid, ownerId: player.id, validTargets: targets.map((t) => t.uid), optional: true, pendingBattleAttackerUid: attackerUid };
      }
    },
  },

  // rbs01040Carnabera, rbs01041NaNascita: Current Invoke Flash in INVOKE_FLASH_HANDLERS

  rbs01041NaNascita: {
    onBlock(game, spirit, _player, level) {
      if (level < 2) return;
      if (spirit._blockRefreshUsed) return;
      spirit.exhausted = false;
      spirit._blockRefreshUsed = true;
      game.addLog(`${spirit.name}: refreshed (True Release, blocking).`);
    },
  },

  rbs01042Tokkaricca: {
    onSummon(game, spirit, player) {
      const currents = player.spirits.filter((s) => hasCurrent(s.cardId) && s.uid !== spirit.uid).slice(0, 2);
      currents.forEach((s) => {
        s.cores.normal += 1;
        game.addLog(`${spirit.name}: core from Void → ${s.name}.`);
      });
    },
    onEndStep(game, spirit, player, level) {
      if (level < 2) return;
      const target = player.spirits.find((s) => s.color === "green" && s.exhausted);
      if (!target) return;
      target.exhausted = false;
      game.addLog(`${spirit.name}: refreshed ${target.name}.`);
    },
  },

  rbs01043TheAlchemiceKlite: {
    onSummon(game, spirit, player) {
      const opp = game._opp(player);
      if (!opp.spirits.length) return;
      if (player.isAi) {
        const best = opp.spirits.sort((a, b) => getEffectiveBP(b, CARD_POOL[b.cardId]) - getEffectiveBP(a, CARD_POOL[a.cardId]))[0];
        best.exhausted = true;
        game.addLog(`${spirit.name}: exhausted ${best.name}.`);
      } else {
        game.awaitingEffect = { type: "exhaustSpirit", label: `${spirit.name}: Exhaust opposing Spirit`, sourceUid: spirit.uid, ownerId: player.id, validTargets: opp.spirits.map((s) => s.uid), optional: true, pendingBattleAttackerUid: null };
      }
    },
    onAttackWin(game, spirit, player, level) {
      if (level < 2) return;
      if (player.isAi) {
        const best = player.spirits.sort((a, b) => getEffectiveBP(b, CARD_POOL[b.cardId]) - getEffectiveBP(a, CARD_POOL[a.cardId]))[0];
        game._coreFromVoidToSpirit(player, best.uid);
        game.addLog(`${spirit.name}: core from Void → ${best.name}.`);
      } else {
        game.awaitingEffect = { type: "coreFromVoidToOwnSpirit", label: `${spirit.name}: Core from Void to own Spirit`, sourceUid: spirit.uid, ownerId: player.id, validTargets: player.spirits.map((s) => s.uid), optional: true, pendingBattleAttackerUid: null };
      }
    },
  },

  rbs01044TheSeaMonsterMorgawler: {
    onAttack(game, spirit, player, _level, attackerUid) {
      if (!player.spirits.some((s) => hasCurrent(s.cardId) && s.uid !== spirit.uid)) return;
      const opp = game._opp(player);
      if (!opp.spirits.length) return;
      if (player.isAi) {
        const best = opp.spirits.sort((a, b) => getEffectiveBP(b, CARD_POOL[b.cardId]) - getEffectiveBP(a, CARD_POOL[a.cardId]))[0];
        best.exhausted = true;
        best._heavyExhausted = true;
        game.addLog(`${spirit.name}: heavy exhausted ${best.name}.`);
      } else {
        game.awaitingEffect = { type: "exhaustSpirit", label: `${spirit.name}: Heavy exhaust opposing Spirit (Current)`, sourceUid: spirit.uid, ownerId: player.id, validTargets: opp.spirits.map((s) => s.uid), optional: true, pendingBattleAttackerUid: attackerUid };
      }
    },
  },

  rbs01045LioneMacina: {},

  rbs01X07TheWaterBladeWheelca: {
    onSummon(game, spirit, player) {
      const opp = game._opp(player);
      const targets = opp.spirits.filter((s) => (CARD_POOL[s.cardId]?.cost ?? 0) <= 3).slice(0, 3);
      targets.forEach((t) => { t.exhausted = true; });
      if (targets.length) game.addLog(`${spirit.name}: exhausted ${targets.length} opposing Spirit${targets.length !== 1 ? "s" : ""} (Cost≤3).`);
    },
    onStartAttackStep(game, spirit, player, level) {
      if (level < 2) return;
      player.spirits.filter((s) => isArmoredFish(s.cardId)).forEach((s) => {
        s.bpBoost = (s.bpBoost ?? 0) + 1000;
        game.addLog(`${spirit.name}: ${s.name} +1000 BP (Armored Fish).`);
      });
    },
  },

  rbs01X08MermaidjaPrincess: {
    onSummon(game, spirit) {
      spirit.cores.normal += 1;
      game.addLog(`${spirit.name}: core from Void → self.`);
    },
    // LV2 TR Current Invoke Flash in INVOKE_FLASH_HANDLERS
  },

  rbs01X09TheDeepBlowWhala: {
    onSummon(game, spirit, player) {
      const currentCount = player.spirits.filter((s) => hasCurrent(s.cardId) && s.uid !== spirit.uid).length;
      if (!currentCount) return;
      const opp = game._opp(player);
      const targets = opp.spirits.slice(0, currentCount);
      targets.forEach((t) => { t.exhausted = true; t._heavyExhausted = true; });
      if (targets.length) game.addLog(`${spirit.name}: heavy exhausted ${targets.length} opposing Spirit${targets.length !== 1 ? "s" : ""}.`);
    },
    // LV2 During Attack Invoke Flash in INVOKE_FLASH_HANDLERS
  },

  // ---- RBS01 White ----

  rbs01046Gonpon: {
    onDestroy(game, spirit, player, level) {
      if (level < 2) return;
      const opp = game._opp(player);
      const targets = opp.spirits.filter((s) => getEffectiveBP(s, CARD_POOL[s.cardId]) <= 5000);
      if (!targets.length) return;
      if (player.isAi) {
        game._returnToHand(opp, targets[0].uid);
      } else {
        game.awaitingEffect = { type: "returnToHand", label: `${spirit.name}: Return opposing ≤5000 BP to Hand`, sourceUid: spirit.uid, ownerId: player.id, validTargets: targets.map((t) => t.uid), optional: false, pendingBattleAttackerUid: null };
      }
    },
  },

  rbs01047Morgoran: {
    onDestroy(game, spirit, player) {
      // Only if it's the opposing attack step
      if (game.currentPlayer === player.id) return;
      const target = player.spirits.find((s) => isMineroid(s.cardId) && s.exhausted && s.uid !== spirit.uid);
      if (!target) return;
      target.exhausted = false;
      game.addLog(`${spirit.name}: refreshed ${target.name} (Mineroid).`);
    },
  },

  rbs01048Goztaurus: {
    onAttackWin(game, spirit, player) {
      if (!player.spirits.some((s) => s.cardId === "rbs01051Meztaurus")) return;
      draw(player, 1);
      game.addLog(`${spirit.name}: drew 1 card (Meztaurus).`);
    },
    onBlockWin(game, spirit, player) {
      if (!player.spirits.some((s) => s.cardId === "rbs01051Meztaurus")) return;
      draw(player, 1);
      game.addLog(`${spirit.name}: drew 1 card (Meztaurus).`);
    },
    // LV2 TR Amplify Invoke Flash in INVOKE_FLASH_HANDLERS
  },

  rbs01049SolShimmer: {
    onSummon(game, spirit, player) {
      const revealed = player.deck.splice(0, 3);
      const pick = revealed.find((id) => CARD_POOL[id]?.type === "spirit" && hasAmplify(id));
      if (pick) {
        player.hand.push(pick);
        player.deck.push(...revealed.filter((id) => id !== pick));
        game.addLog(`${spirit.name}: added ${CARD_POOL[pick]?.name} to hand.`);
      } else {
        player.deck.push(...revealed);
        game.addLog(`${spirit.name}: no Amplify Spirit found.`);
      }
    },
  },

  // rbs01050Claydoro: LV2 TR Amplify Invoke Flash in INVOKE_FLASH_HANDLERS

  rbs01051Meztaurus: {
    // Amplify Invoke Flash in INVOKE_FLASH_HANDLERS
    onAttackWin(game, spirit, player, level) {
      if (level < 2) return;
      if (player.isAi) {
        const best = player.spirits.sort((a, b) => getEffectiveBP(b, CARD_POOL[b.cardId]) - getEffectiveBP(a, CARD_POOL[a.cardId]))[0];
        game._coreFromVoidToSpirit(player, best.uid);
        game.addLog(`${spirit.name}: core from Void → ${best.name}.`);
      } else {
        game.awaitingEffect = { type: "coreFromVoidToOwnSpirit", label: `${spirit.name}: Core from Void to own Spirit`, sourceUid: spirit.uid, ownerId: player.id, validTargets: player.spirits.map((s) => s.uid), optional: true, pendingBattleAttackerUid: null };
      }
    },
  },

  rbs01052Gargouiller: {
    onBlock(game, spirit, player, level) {
      if (level < 2) return;
      const opp = game._opp(player);
      const targets = opp.spirits.filter((s) => (CARD_POOL[s.cardId]?.cost ?? 0) <= 3);
      if (!targets.length) return;
      if (player.isAi) {
        const best = targets.sort((a, b) => getEffectiveBP(b, CARD_POOL[b.cardId]) - getEffectiveBP(a, CARD_POOL[a.cardId]))[0];
        best.exhausted = true;
        game.addLog(`${spirit.name}: exhausted ${best.name}.`);
      } else {
        game.awaitingEffect = { type: "exhaustSpirit", label: `${spirit.name}: Exhaust opposing Cost≤3 Spirit`, sourceUid: spirit.uid, ownerId: player.id, validTargets: targets.map((t) => t.uid), optional: true, pendingBattleAttackerUid: null };
      }
    },
  },

  rbs01053Stellouse: {
    onEndStep(game, spirit, player, level) {
      if (level < 2) return;
      const targets = player.spirits.filter((s) => isLeucomyst(s.cardId) && s.exhausted).slice(0, 2);
      targets.forEach((t) => { t.exhausted = false; game.addLog(`${spirit.name}: refreshed ${t.name}.`); });
    },
  },

  rbs01055TheLiquidSilverFransil: {
    onStartAttackStep(game, spirit, player) {
      if (spirit._oncePerTurnUsed) return;
      const amplifySpirit = player.spirits.find((s) => hasAmplify(s.cardId) && getEffectiveBP(s, CARD_POOL[s.cardId]) >= 8000);
      if (!amplifySpirit) return;
      draw(player, 1);
      spirit._oncePerTurnUsed = true;
      game.addLog(`${spirit.name}: drew 1 card (Amplify ≥8000 BP).`);
    },
  },

  // rbs01056Stelgatgun: Amplify Invoke Flash in INVOKE_FLASH_HANDLERS

  rbs01057HopliShimmer: {
    // Amplify Invoke Flash in INVOKE_FLASH_HANDLERS
    onEndStep(game, spirit, _player, level) {
      if (level < 2) return;
      spirit.exhausted = false;
      game.addLog(`${spirit.name}: refreshed (True Release End Step).`);
    },
  },

  rbs01058TheFabricatedSunwhite: {
    onEndStep(game, spirit, player) {
      if (countSymbols(player, "white") < 3) return;
      while (player.hand.length < 3 && player.deck.length > 0) {
        draw(player, 1);
      }
      game.addLog(`${spirit.name}: drew to hand=3 (3+ white symbols).`);
    },
  },

  rbs01059TheHollowRadiancePeppersDragon: {
    onSummon(game, spirit, player) {
      const opp = game._opp(player);
      const targets = opp.spirits.filter((s) => getEffectiveBP(s, CARD_POOL[s.cardId]) <= 8000);
      if (!targets.length) return;
      if (player.isAi) {
        game._returnToHand(opp, targets.sort((a, b) => getEffectiveBP(b, CARD_POOL[b.cardId]) - getEffectiveBP(a, CARD_POOL[a.cardId]))[0].uid);
      } else {
        game.awaitingEffect = { type: "returnToHand", label: `${spirit.name}: Return opposing ≤8000 BP to Hand`, sourceUid: spirit.uid, ownerId: player.id, validTargets: targets.map((t) => t.uid), optional: false, pendingBattleAttackerUid: null };
      }
    },
    // LV2 TR Amplify Invoke Flash in INVOKE_FLASH_HANDLERS
  },

  rbs01060Mudoro: {
    // Amplify Invoke Flash in INVOKE_FLASH_HANDLERS
    onAttack(game, spirit, player, level) {
      if (level < 2) return;
      if (player.isAi) {
        const best = player.spirits.sort((a, b) => getEffectiveBP(b, CARD_POOL[b.cardId]) - getEffectiveBP(a, CARD_POOL[a.cardId]))[0];
        game._coreFromVoidToSpirit(player, best.uid);
        game.addLog(`${spirit.name}: core from Void → ${best.name}.`);
      } else {
        game.awaitingEffect = { type: "coreFromVoidToOwnSpirit", label: `${spirit.name}: Core from Void to own Spirit`, sourceUid: spirit.uid, ownerId: player.id, validTargets: player.spirits.map((s) => s.uid), optional: false, pendingBattleAttackerUid: null };
      }
    },
  },

  rbs01X10TheLiquidSilverGeneralRgyum: {
    onSummon(game, spirit, player) {
      if (!player.spirits.some((s) => hasAmplify(s.cardId) && s.uid !== spirit.uid)) return;
      while (player.hand.length < 3 && player.deck.length > 0) draw(player, 1);
      game.addLog(`${spirit.name}: drew to hand=3 (Amplify present).`);
    },
  },

  rbs01X11TheArgentIronDukeLarsBeriberg: {
    // Amplify Invoke Flash in INVOKE_FLASH_HANDLERS
    onAttack(game, spirit, _player, level) {
      if (level < 2) return;
      if (spirit._oncePerTurnUsed) return;
      const bp = getEffectiveBP(spirit, CARD_POOL[spirit.cardId]);
      if (bp >= 12000) {
        spirit.exhausted = false;
        spirit._oncePerTurnUsed = true;
        game.addLog(`${spirit.name}: refreshed (BP ≥12000).`);
      }
    },
  },

  rbs01X12TheFourAdamantGigantocheires: {
    onAttack(game, spirit, player, _level, attackerUid) {
      if (spirit._oncePerTurnUsed) return;
      const opp = game._opp(player);
      const spiritTargets = opp.spirits.filter((s) => getEffectiveBP(s, CARD_POOL[s.cardId]) <= 6000);
      const nexusTargets = opp.nexuses;
      if (!spiritTargets.length && !nexusTargets.length) return;
      spirit._oncePerTurnUsed = true;
      if (spiritTargets.length) {
        if (player.isAi) {
          game._returnToHand(opp, spiritTargets.sort((a, b) => getEffectiveBP(b, CARD_POOL[b.cardId]) - getEffectiveBP(a, CARD_POOL[a.cardId]))[0].uid);
          game._coreFromVoidToSpirit(player, spirit.uid);
        } else {
          game.awaitingEffect = { type: "returnToHand", label: `${spirit.name}: Return opposing ≤6000 BP Spirit to Hand`, sourceUid: spirit.uid, ownerId: player.id, validTargets: spiritTargets.map((t) => t.uid), optional: false, pendingBattleAttackerUid: attackerUid };
        }
      }
    },
  },

  // ---- RBS01 Yellow ----

  rbs01061Stodol: {
    onMagicPlay(game, spirit, player, level, magicCardId) {
      if (level < 2) return;
      if (!isTopaz(magicCardId)) return;
      // Only during opposing attack step
      if (game.currentPlayer === player.id) return;
      spirit.bpBoost = (spirit.bpBoost ?? 0) + 2000;
      game.addLog(`${spirit.name}: +2000 BP (Topaz Magic, opposing step).`);
    },
  },

  rbs01062Aloucast: {
    onMagicPlay(game, spirit, player, level, magicCardId) {
      if (level < 2) return;
      if (!isTopaz(magicCardId)) return;
      if (game.currentPlayer === player.id) return;
      spirit.bpBoost = (spirit.bpBoost ?? 0) + 2000;
      game.addLog(`${spirit.name}: +2000 BP (Topaz Magic, opposing step).`);
    },
  },

  // rbs01063BoltSheep: INVOKE_MAIN_HANDLERS

  rbs01064Sorcereed: {},

  rbs01065TerraCotta: {
    onMagicPlay(game, spirit, player, _level, magicCardId) {
      if (!isTopaz(magicCardId)) return;
      if (game.currentPlayer === player.id) return;
      spirit.bpBoost = (spirit.bpBoost ?? 0) + 2000;
      game.addLog(`${spirit.name}: +2000 BP (Topaz Magic, opposing step).`);
    },
  },

  rbs01066Velocirant: {
    onAttack(game, spirit, player, _level, attackerUid) {
      const opp = game._opp(player);
      if (!opp.spirits.length) return;
      if (player.isAi) {
        const best = opp.spirits.sort((a, b) => getEffectiveBP(a, CARD_POOL[a.cardId]) - getEffectiveBP(b, CARD_POOL[b.cardId]))[0];
        game._bpDamage(opp, best.uid, 2000);
        game.addLog(`${spirit.name}: -2000 BP to ${best.name}.`);
      } else {
        game.awaitingEffect = { type: "bpDamage2000", label: `${spirit.name}: -2000 BP to opposing Spirit`, sourceUid: spirit.uid, ownerId: player.id, validTargets: opp.spirits.map((s) => s.uid), optional: false, pendingBattleAttackerUid: attackerUid };
      }
    },
    onEndStep(game, spirit, player, level) {
      if (level < 2) return;
      if (!player._usedThunderDragonMagicThisTurn) return;
      spirit.exhausted = false;
      game.addLog(`${spirit.name}: refreshed (Thunder Dragon Magic this turn).`);
    },
    onMagicPlay(_game, _spirit, player, _level, magicCardId) {
      if (isThunderDragon(magicCardId)) player._usedThunderDragonMagicThisTurn = true;
    },
  },

  rbs01067ThunderSquatch: {
    onMagicPlay(game, spirit, player, _level, magicCardId) {
      if (!isTopaz(magicCardId)) return;
      if (game.currentPlayer === player.id) return;
      spirit.exhausted = false;
      game.addLog(`${spirit.name}: refreshed (Topaz Magic, opposing step).`);
    },
  },

  rbs01068Snakrowley: {
    onSummon(game, spirit, player) {
      if (!player._usedTopazMagicThisTurn) return;
      draw(player, 2);
      game.addLog(`${spirit.name}: drew 2 cards (Topaz Magic used this turn).`);
    },
    onMagicPlay(game, spirit, player, level, magicCardId) {
      if (level < 2) return;
      if (!isTopaz(magicCardId)) return;
      if (game.currentPlayer === player.id) return;
      spirit.bpBoost = (spirit.bpBoost ?? 0) + 2000;
      game.addLog(`${spirit.name}: +2000 BP (Topaz Magic, opposing step).`);
    },
  },

  rbs01069TheBreakingThunderSpinoblurt: {
    onAttack(game, spirit, player, _level, attackerUid) {
      const opp = game._opp(player);
      if (!opp.spirits.length) return;
      if (player.isAi) {
        const best = opp.spirits.sort((a, b) => getEffectiveBP(a, CARD_POOL[a.cardId]) - getEffectiveBP(b, CARD_POOL[b.cardId]))[0];
        game._bpDamage(opp, best.uid, 2000);
        game.addLog(`${spirit.name}: -2000 BP to ${best.name}.`);
      } else {
        game.awaitingEffect = { type: "bpDamage2000", label: `${spirit.name}: -2000 BP to opposing Spirit`, sourceUid: spirit.uid, ownerId: player.id, validTargets: opp.spirits.map((s) => s.uid), optional: false, pendingBattleAttackerUid: attackerUid };
      }
    },
    onStartAttackStep(game, spirit, player, level) {
      if (level < 2) return;
      player.spirits.filter((s) => isThunderDragon(s.cardId)).forEach((s) => {
        s.bpBoost = (s.bpBoost ?? 0) + 2000;
        game.addLog(`${spirit.name}: ${s.name} +2000 BP (Thunder Dragon).`);
      });
    },
  },

  rbs01071TheSedutiveFuryRandarisa: {
    onSummon(game, spirit, player) {
      const idx = player.trash.findLastIndex((id) => isEchochant(id) && CARD_POOL[id]?.type === "magic");
      if (idx < 0) return;
      const [cardId] = player.trash.splice(idx, 1);
      player.hand.push(cardId);
      game.addLog(`${spirit.name}: ${CARD_POOL[cardId]?.name} returned to hand.`);
    },
  },

  // rbs01070Steguman (Yellow)
  // [LV1-2] When Destroyed by Opponent: Re-trigger one Topaz Spirit's When Summoned
  rbs01070Steguman: {
    onDestroy(game, spirit, player) {
      const topaz = player.spirits.filter((s) => isTopaz(s.cardId));
      if (!topaz.length) return;
      if (player.isAi) {
        const t = topaz[0];
        CARD_EFFECTS[t.cardId]?.onSummon?.(game, t, player);
        game.addLog(`${spirit.name}: re-triggered ${t.name}'s When Summoned.`);
      } else {
        game.awaitingEffect = {
          type: "triggerSummonEffect",
          label: `${spirit.name}: Re-trigger a Topaz Spirit's When Summoned`,
          ownerId: player.id,
          validTargets: topaz.map((s) => s.uid),
          optional: true,
          pendingBattleAttackerUid: null,
        };
      }
    },
  },

  rbs01072Thunderai: {}, // [LV2] Magirrate Invoke Flash in INVOKE_FLASH_HANDLERS

  rbs01073TheTwinFuryBaronram: {
    onSummon(game, spirit, player) {
      if (player.life > 2) return;
      player.life += 1;
      // Actually move core from reserve to life: in this game, life is just a number
      // Properly: put core from Void to Life = increase life by 1
      game.addLog(`${spirit.name}: life +1 (was ≤2).`);
    },
  },

  rbs01074TheHeavyThunderEnurai: {
    onSummon(game, spirit, player) {
      const revealed = player.deck.splice(0, 4);
      const pick = revealed.find((id) => CARD_POOL[id]?.type === "magic" && CARD_POOL[id]?.color === "yellow");
      if (pick) {
        player.hand.push(pick);
        player.deck.push(...revealed.filter((id) => id !== pick));
        game.addLog(`${spirit.name}: added ${CARD_POOL[pick]?.name} to hand.`);
      } else {
        player.deck.push(...revealed);
        game.addLog(`${spirit.name}: no Yellow Magic found.`);
      }
    },
    onMagicPlay(game, spirit, _player, level, magicCardId) {
      if (level < 2) return;
      if (CARD_POOL[magicCardId]?.color !== "yellow") return;
      spirit.bpBoost = (spirit.bpBoost ?? 0) + 2000;
      game.addLog(`${spirit.name}: +2000 BP (Yellow Magic).`);
    },
  },

  rbs01075Potariwa: {}, // [LV1-2] Magirrate Invoke Flash in INVOKE_FLASH_HANDLERS; Legacy skipped

  rbs01X13TheMageKingPuppetIgleMitas: {
    // Invoke Main in INVOKE_MAIN_HANDLERS
    onMagicPlay(game, spirit, player, level, magicCardId) {
      if (level < 2) return;
      if (CARD_POOL[magicCardId]?.color !== "yellow") return;
      // Target own Echochant spirit: can't be blocked this turn
      const target = player.spirits.find((s) => isEchochant(s.cardId) && s.uid !== spirit.uid);
      if (!target) return;
      target._cantBeBlockedCostLimit = 999;
      game.addLog(`${spirit.name}: ${target.name} can't be blocked (Yellow Magic).`);
    },
  },

  rbs01X14TheMegaThunderZelotl: {
    onSummon(game, spirit, player) {
      const opp = game._opp(player);
      const targets = opp.spirits.slice(0, 2);
      targets.forEach((t) => {
        game._bpDamage(opp, t.uid, 2000);
        game.addLog(`${spirit.name}: -2000 BP to ${t.name}.`);
      });
    },
    onMagicPlay(game, spirit, player, level, magicCardId) {
      if (level < 2) return;
      if (!isThunderDragon(magicCardId)) return;
      if (spirit._oncePerTurnUsed) return;
      // Return the magic card to hand (it was just moved to trash)
      const magicIdx = player.trash.lastIndexOf(magicCardId);
      if (magicIdx >= 0) {
        player.trash.splice(magicIdx, 1);
        player.hand.push(magicCardId);
        spirit._oncePerTurnUsed = true;
        game.addLog(`${spirit.name}: ${CARD_POOL[magicCardId]?.name} returned to hand.`);
      }
    },
  },

  rbs01X15TheReturningThunderEmbalmimer: {
    onMagicPlay(game, spirit, _player, level, magicCardId) {
      if (level < 2) return;
      if (!isTopaz(magicCardId)) return;
      // Extra Yellow symbol during battle — approximate: give +1000 BP (simplified)
      spirit.bpBoost = (spirit.bpBoost ?? 0) + 1000;
      game.addLog(`${spirit.name}: +1000 BP (extra symbol approximation, Topaz Magic).`);
    },
  },

  // ---- RBS01 Blue ----

  rbs01076Tamink: {
    onSummon(game, spirit, player) {
      const target = player.spirits.find((s) => hasRumble(s.cardId) && s.uid !== spirit.uid);
      if (!target) return;
      game._coreFromVoidToSpirit(player, target.uid);
      game.addLog(`${spirit.name}: core from Void → ${target.name} (Rumble).`);
    },
  },

  rbs01077Lulivora: {
    onAttack(_game, spirit) { spirit._rumbleN = 3; },
    onEndStep(game, spirit, _player, level) {
      if (level < 2) return;
      spirit.exhausted = false;
      game.addLog(`${spirit.name}: refreshed.`);
    },
  },

  rbs01078Eripides: {},

  rbs01079Fergus: {
    onAttack(_game, spirit) { spirit._rumbleN = 3; },
  },

  rbs01080Virgal: {
    onAttack(game, spirit, player, level) {
      if (player.nexuses.length > 0) {
        spirit.bpBoost = (spirit.bpBoost ?? 0) + 4000;
        game.addLog(`${spirit.name}: +4000 BP (own Nexus).`);
      }
      if (level < 2) return;
      const nx = player.nexuses.find((n) => n.exhausted);
      if (!nx) return;
      nx.exhausted = false;
      game.addLog(`${spirit.name}: refreshed ${nx.name}.`);
    },
  },

  rbs01081Bisoroth: {
    onAttack(game, spirit, player, level) {
      spirit._rumbleN = 4;
      if (level < 2) return;
      if (countSymbols(player, "blue") < 2) return;
      spirit.bpBoost = (spirit.bpBoost ?? 0) + 2000;
      game.addLog(`${spirit.name}: +2000 BP (2+ blue symbols).`);
    },
  },

  rbs01082Badgernan: {
    onAttack(game, spirit, player, level) {
      spirit._rumbleN = 4;
      if (level < 2) return;
      draw(player, 2);
      // Return 2 to deckbottom
      if (player.hand.length >= 2) {
        const returned = player.hand.splice(0, 2);
        player.deck.push(...returned);
        game.addLog(`${spirit.name}: drew 2, returned 2 to deckbottom.`);
      }
    },
  },

  rbs01083TheCyanBudAnelna: {
    onStartAttackStep(game, spirit, player) {
      const blueNexusCount = player.nexuses.filter((n) => n.color === "blue").length;
      if (!blueNexusCount) return;
      player.spirits.forEach((s) => {
        s.bpBoost = (s.bpBoost ?? 0) + blueNexusCount * 1000;
      });
      game.addLog(`${spirit.name}: all spirits +${blueNexusCount * 1000} BP (${blueNexusCount} blue Nexus).`);
    },
  },

  rbs01084Ganasha: {
    onSummon(game, spirit, player) {
      const opp = game._opp(player);
      const targets = opp.spirits.filter((s) => (CARD_POOL[s.cardId]?.cost ?? 0) <= 3);
      if (!targets.length) return;
      game._effectOrAuto(player, targets, spirit.uid, null, `${spirit.name}: Destroy opposing Cost≤3 Spirit`, false);
    },
    onAttack(_game, spirit) { spirit._rumbleN = 5; },
  },

  rbs01085TheTreeWearGreetora: {
    onAttack(game, spirit, player, level) {
      if (player.nexuses.filter((n) => n.color === "blue").length >= 3) {
        spirit.bpBoost = (spirit.bpBoost ?? 0) + 3000;
        game.addLog(`${spirit.name}: +3000 BP (3+ blue Nexuses).`);
      }
      if (level < 2) return;
      const revealed = player.deck.splice(0, 3);
      const pick = revealed.find((id) => isFerobeast(id) && CARD_POOL[id]?.type === "nexus");
      if (pick) {
        player.hand.push(pick);
        player.deck.push(...revealed.filter((id) => id !== pick));
        game.addLog(`${spirit.name}: added ${CARD_POOL[pick]?.name} to hand.`);
      } else {
        player.deck.push(...revealed);
      }
    },
  },

  rbs01086Ligeron: {
    onAttack(game, spirit, player) {
      const count = player.nexuses.filter((n) => n.color === "blue").length;
      if (!count) return;
      spirit.bpBoost = (spirit.bpBoost ?? 0) + count * 1000;
      game.addLog(`${spirit.name}: +${count * 1000} BP (${count} blue Nexus).`);
    },
  },

  rbs01087MadraMagona: {
    onAttack(_game, spirit) { spirit._rumbleN = 6; },
  },

  rbs01088TheHonorableSaintar: {
    onAttack(game, spirit, _player, level) {
      if (level >= 2) {
        spirit.bpBoost = (spirit.bpBoost ?? 0) + 2000;
        game.addLog(`${spirit.name}: +2000 BP (True Release).`);
      }
      // "When this Spirit's attack reduces life, draw 2 return 1" - use _drawOnLifeReduce flag
      spirit._drawOnLifeReduce = true;
    },
  },

  rbs01089Nodorien: {
    onAttack(game, spirit, player, level) {
      spirit._rumbleN = 7;
      if (level < 2) return;
      if (countSymbols(player, "blue") < 2) return;
      spirit.bpBoost = (spirit.bpBoost ?? 0) + 2000;
      game.addLog(`${spirit.name}: +2000 BP (2+ blue symbols).`);
    },
  },

  // rbs01090TheAzureGaitBalpnir: INVOKE_FLASH_HANDLERS

  rbs01X16TheGreatAbsolutePanjang: {
    onSummon(game, spirit, player) {
      const revealed = player.deck.splice(0, 3);
      const pick = revealed.find((id) => CARD_POOL[id]?.type === "spirit" && hasRumble(id));
      if (pick) {
        player.hand.push(pick);
        player.deck.push(...revealed.filter((id) => id !== pick));
        game.addLog(`${spirit.name}: added ${CARD_POOL[pick]?.name} to hand.`);
      } else {
        player.deck.push(...revealed);
        game.addLog(`${spirit.name}: no Rumble Spirit found.`);
      }
    },
    onStartAttackStep(_game, spirit, _player, level) {
      // LV2 TR: give +2 Rumble bonus to all Rumble spirits this turn
      if (level < 2) return;
      spirit._rumbleBoost = 2;
    },
    onAttack(game, spirit) {
      if (spirit._rumbleBoost) {
        // Apply bonus to all own Rumble spirits this attack step
        spirit._rumbleBonus = spirit._rumbleBoost;
        delete spirit._rumbleBoost;
        game.addLog(`${spirit.name}: Rumble +2 this turn.`);
      }
    },
  },

  rbs01X17TheCrawlingForestCrawler: {
    onSummon(game, spirit, player) {
      const targets = player.nexuses.filter((n) => n.color === "blue").slice(0, 2);
      targets.forEach((n) => {
        n.cores = n.cores ?? { normal: 0 };
        n.cores.normal = (n.cores.normal ?? 0) + 1;
        game.addLog(`${spirit.name}: core from Void → ${n.name}.`);
      });
    },
  },

  rbs01X18TheShelledBeastNepbalander: {
    onAttack(_game, spirit) { spirit._rumbleN = 7; },
  },
};

// --- Magic effect handlers ---

const MAGIC_EFFECTS = {
  rsd01012BreakClaw: {
    getMainTargets(game, player) {
      return game._opp(player).nexuses.map((n) => ({ uid: n.uid, label: n.name }));
    },
    main(game, player, targetUid) {
      const opp = game._opp(player);
      const idx = opp.nexuses.findIndex((n) => n.uid === targetUid);
      if (idx < 0) return;
      const nx = opp.nexuses.splice(idx, 1)[0];
      opp.reserve.normal += nx.cores.normal;
      if (nx.cores.soul) opp.reserve.soul = true;
      game.addLog(`Break Claw destroys ${nx.name}.`);
      if (player.spirits.some((s) => s.color === "red" && s.exhausted) && player.trashCore.normal > 0) {
        player.trashCore.normal -= 1;
        player.reserve.normal += 1;
        game.addLog(`Break Claw: 1 core Trash → Reserve.`);
      }
    },
  },

  rsd01013OfferingDraw: {
    getMainTargets() { return []; },
    main(game, player) {
      const revealed = player.deck.splice(0, 3);
      const wf = revealed.filter(id => isWindfang(id) && id !== "rsd01013OfferingDraw");
      const toHand = wf.slice(0, 2);
      const toBottom = [...wf.slice(2), ...revealed.filter(id => !wf.includes(id))];
      game.awaitingEffect = {
        type: "deckReveal",
        label: "Offering Draw: Reveal",
        sourceName: "Offering Draw",
        ownerId: player.id,
        revealed,
        toHand,
        toBottom,
        validTargets: [],
        optional: false,
        pendingBattleAttackerUid: null,
      };
    },
  },

  // RBS01 Yellow: LifeLink Main — reveal top, if Magic add to hand
  rbs01121LifeLink: {
    getMainTargets() { return []; },
    main(game, player) {
      const [top] = player.deck.splice(0, 1);
      if (!top) { game.addLog(`Life Link: deck empty.`); return; }
      if (CARD_POOL[top]?.type === "magic") {
        player.hand.push(top);
        game.addLog(`Life Link: ${CARD_POOL[top]?.name} added to Hand.`);
      } else {
        player.deck.unshift(top);
        game.addLog(`Life Link: ${CARD_POOL[top]?.name} returned to decktop.`);
      }
    },
  },

  // RBS01 Blue: FindTreasure Main — deploy Cost≤5 Blue Nexus from Trash
  rbs01124FindTreasure: {
    getMainTargets() { return []; },
    main(game, player) {
      const pick = player.trash.find((id) => CARD_POOL[id]?.type === "nexus" && CARD_POOL[id]?.color === "blue" && (CARD_POOL[id]?.cost ?? 0) <= 5);
      if (!pick) { game.addLog(`Find Treasure: no Cost≤5 Blue Nexus in Trash.`); return; }
      player.trash.splice(player.trash.indexOf(pick), 1);
      const nx = { cardId: pick, uid: `${pick}_${Date.now()}`, name: CARD_POOL[pick]?.name, cores: { normal: 0, soul: false }, exhausted: false };
      player.nexuses.push(nx);
      game.addLog(`Find Treasure: deployed ${nx.name} from Trash.`);
    },
  },

  // RSD05 Yellow: Fire Pillar Main — draw a card
  rsd05011FirePillar: {
    getMainTargets() { return []; },
    main(game, player) {
      const drawn = player.deck.splice(0, 1);
      if (drawn.length > 0) {
        player.hand.push(drawn[0]);
        game.addLog(`Fire Pillar: drew ${CARD_POOL[drawn[0]]?.name ?? 'a card'}.`);
      } else {
        game.addLog(`Fire Pillar: deck is empty.`);
      }
    },
  },

  // RSD05 Yellow: Rebirth Thunder (Flash only, no Main effect)
  rsd05012RebirthThunder: {
    getMainTargets() { return []; },
  },

  // RSD05 Yellow: Nestling Main — show up to 2 Thunder Dragon cards from hand, return to deckbottom, draw 3 if 2 returned
  rsd05013Nestling: {
    getMainTargets() { return []; },
    main(game, player) {
      if (player.hand.length === 0) {
        game.addLog(`Nestling: no cards in hand.`);
        return;
      }
      const tdCards = player.hand.filter((id) => CARD_POOL[id]?.family && (Array.isArray(CARD_POOL[id].family) ? CARD_POOL[id].family.includes("Thunder Dragon") : CARD_POOL[id].family === "Thunder Dragon"));
      if (tdCards.length === 0) {
        game.addLog(`Nestling: no Thunder Dragon family cards in hand.`);
        return;
      }
      if (player.isAi) {
        const toReturn = tdCards.slice(0, 2);
        toReturn.forEach((id) => {
          const idx = player.hand.indexOf(id);
          if (idx >= 0) player.hand.splice(idx, 1);
          player.deck.push(id);
        });
        if (toReturn.length === 2) {
          const drawn = player.deck.splice(0, 3);
          player.hand.push(...drawn);
          game.addLog(`Nestling: returned 2 Thunder Dragon cards, drew 3 cards.`);
        } else {
          game.addLog(`Nestling: returned ${toReturn.length} Thunder Dragon card(s).`);
        }
      } else {
        game.awaitingEffect = {
          type: "nestlingSelectCards",
          label: `Nestling: Select up to 2 Thunder Dragon family cards from Hand to return to deckbottom`,
          ownerId: player.id,
          validTargets: tdCards,
          optional: true,
          pendingBattleAttackerUid: null,
        };
      }
    },
  },

  // RSD02 Purple: Dark Hang Main — destroy own Bloodrouse spirit, put 1 core from Void to Reserve
  rsd02011DarkHang: {
    getMainTargets(game, player) {
      return player.spirits
        .filter((s) => isBloodrouse(s.cardId))
        .map((s) => ({ uid: s.uid, label: `${s.name} (destroy)` }));
    },
    main(game, player, targetUid) {
      const s = player.spirits.find((sp) => sp.uid === targetUid);
      if (s) {
        game._destroyOwnSpirit(player, targetUid);
        if (player.voidCore > 0) {
          player.voidCore -= 1;
          player.reserve.normal += 1;
          game.addLog(`Dark Hang: destroyed ${s.name}, put 1 core from Void to Reserve.`);
        } else {
          game.addLog(`Dark Hang: destroyed ${s.name}, but no cores in Void.`);
        }
      }
    },
  },

  // RSD03 Blue: Hand Molt Main — return all hand to deck bottom, draw cards = opposing hand size
  rsd03012HandMolt: {
    getMainTargets() { return []; },
    main(game, player) {
      const handSize = player.hand.length;
      const oppHandSize = game._opp(player).hand.length;
      if (handSize > 0) {
        player.hand.forEach((id) => player.deck.push(id));
        player.hand = [];
        game.addLog(`Hand Molt: returned ${handSize} card(s) to deck bottom.`);
      } else {
        game.addLog(`Hand Molt: no cards in hand.`);
      }
      if (oppHandSize > 0) {
        const drawn = player.deck.splice(0, oppHandSize);
        player.hand.push(...drawn);
        game.addLog(`Hand Molt: drew ${oppHandSize} card(s).`);
      }
    },
  },

  // RSD04 White: Rock Drilling Main — show up to 3 Mineroid cards from hand, return to deck bottom, draw 1 per card
  rsd04012RockDrilling: {
    getMainTargets() { return []; },
    main(game, player) {
      if (player.hand.length === 0) {
        game.addLog(`Rock Drilling: no cards in hand.`);
        return;
      }
      const mineroidCards = player.hand.filter((id) => CARD_POOL[id]?.family && (Array.isArray(CARD_POOL[id].family) ? CARD_POOL[id].family.includes("Mineroid") : CARD_POOL[id].family === "Mineroid"));
      if (mineroidCards.length === 0) {
        game.addLog(`Rock Drilling: no Mineroid family cards in hand.`);
        return;
      }
      if (player.isAi) {
        const toReturn = mineroidCards.slice(0, 3);
        toReturn.forEach((id) => {
          const idx = player.hand.indexOf(id);
          if (idx >= 0) player.hand.splice(idx, 1);
          player.deck.push(id);
        });
        const drawn = player.deck.splice(0, toReturn.length);
        player.hand.push(...drawn);
        game.addLog(`Rock Drilling: returned ${toReturn.length} Mineroid card(s), drew ${toReturn.length} card(s).`);
      } else {
        game.awaitingEffect = {
          type: "rockDrillingSelectCards",
          label: `Rock Drilling: Select up to 3 Mineroid family cards to return to deck bottom`,
          ownerId: player.id,
          validTargets: mineroidCards,
          optional: true,
          pendingBattleAttackerUid: null,
        };
      }
    },
  },

  // RSD06 Blue: Feeding Draw Main — draw 3, return 2 from hand to deck bottom
  rsd06012FeedingDraw: {
    getMainTargets() { return []; },
    main(game, player) {
      const drawn = player.deck.splice(0, 3);
      player.hand.push(...drawn);
      game.addLog(`Feeding Draw: drew 3 cards.`);
      if (player.hand.length >= 2) {
        if (player.isAi) {
          const toReturn = player.hand.splice(0, 2);
          toReturn.forEach((id) => player.deck.push(id));
          game.addLog(`Feeding Draw: returned 2 cards to deck bottom.`);
        } else {
          game.awaitingEffect = {
            type: "feedingDrawReturnCards",
            label: `Feeding Draw: Select 2 cards from Hand to return to deck bottom`,
            ownerId: player.id,
            validTargets: player.hand.map((_, i) => i),
            optional: false,
            pendingBattleAttackerUid: null,
          };
        }
      } else {
        game.addLog(`Feeding Draw: not enough cards to return.`);
      }
    },
  },

  // RSD06 Blue: Full Stomach Main — destroy target nexus (yours or opp), draw a card if successful
  rsd06014FullStomach: {
    getMainTargets(game, player) {
      const targets = [...player.nexuses, ...game._opp(player).nexuses]
        .filter((n) => !n._trueRelease)
        .map((n) => ({ uid: n.uid, label: n.name }));
      return targets;
    },
    main(game, player, targetUid) {
      const opp = game._opp(player);
      let found = null;
      let isOwnNexus = false;
      found = player.nexuses.find((n) => n.uid === targetUid);
      if (found) {
        isOwnNexus = true;
      } else {
        found = opp.nexuses.find((n) => n.uid === targetUid);
      }
      if (found) {
        const owner = isOwnNexus ? player : opp;
        const idx = owner.nexuses.indexOf(found);
        if (idx >= 0) owner.nexuses.splice(idx, 1);
        owner.reserve.normal += found.cores.normal;
        if (found.cores.soul) owner.reserve.soul = true;
        game.addLog(`Full Stomach: destroyed ${found.name}.`);
        const drawn = player.deck.splice(0, 1);
        if (drawn.length > 0) {
          player.hand.push(...drawn);
          game.addLog(`Full Stomach: drew a card.`);
        }
      }
    },
  },
};

// --- Flash handlers ---

const MAGIC_FLASH_EFFECTS = {
  rsd01012BreakClaw: {
    getFlashTargets(_game, player) {
      return player.spirits.map((s) => ({ uid: s.uid, label: `${s.name} (+3000 BP)` }));
    },
    flash(game, player, targetUid) {
      const s = player.spirits.find((sp) => sp.uid === targetUid);
      if (s) { s.bpBoost = (s.bpBoost ?? 0) + 3000; game.addLog(`Break Claw: ${s.name} +3000 BP.`); }
    },
  },
  rsd01013OfferingDraw: {
    getFlashTargets(_game, player) {
      return player.spirits.map((s) => ({ uid: s.uid, label: `${s.name} (+2000 BP)` }));
    },
    flash(game, player, targetUid) {
      const s = player.spirits.find((sp) => sp.uid === targetUid);
      if (s) { s.bpBoost = (s.bpBoost ?? 0) + 2000; game.addLog(`Offering Draw: ${s.name} +2000 BP.`); }
    },
  },
  rsd01014FlameHurricane: {
    getFlashTargets(game, player) {
      const bpLimit = game._lifeReducedThisTurn ? 10000 : 7000;
      return game._opp(player).spirits
        .filter((s) => getEffectiveBP(s, CARD_POOL[s.cardId]) <= bpLimit && !s._magicImmune)
        .map((s) => ({ uid: s.uid, label: `${s.name} (destroy)` }));
    },
    flash(game, player, targetUid) {
      const opp = game._opp(player);
      const s = opp.spirits.find((sp) => sp.uid === targetUid);
      if (s) game.destroySpirit(opp, s.uid);
    },
  },

  // RBS01 Red: MeteorCrash — allow opposing exhausted spirit to block this battle
  rbs01109MeteorCrash: {
    getFlashTargets(game, player) {
      return game._opp(player).spirits
        .filter((s) => s.exhausted && !s._magicImmune)
        .map((s) => ({ uid: s.uid, label: `${s.name} (allow block)` }));
    },
    flash(game, player, targetUid) {
      const attacker = game.activePlayer().spirits.find((s) => s.uid === game.awaitingFlash?.attackerUid);
      if (attacker) attacker._forceExhaustedBlock = true;
      const t = game._opp(player).spirits.find((s) => s.uid === targetUid);
      if (t) game.addLog(`Meteor Crash: ${t.name} can block even while exhausted.`);
    },
  },

  // RBS01 Red: MeteorSurfing — destroy ≤5000 BP opposing spirit
  rbs01110MeteorSurfing: {
    getFlashTargets(game, player) {
      return game._opp(player).spirits
        .filter((s) => getEffectiveBP(s, CARD_POOL[s.cardId]) <= 5000 && !s._magicImmune)
        .map((s) => ({ uid: s.uid, label: `${s.name} (destroy)` }));
    },
    flash(game, player, targetUid) {
      const opp = game._opp(player);
      const s = opp.spirits.find((sp) => sp.uid === targetUid);
      if (s) game.destroySpirit(opp, s.uid);
    },
  },

  // RBS01 Red: VermillionRoar — own Clash spirit +3000 BP; on blocker destroy, extra life reduction
  rbs01111VermillionRoar: {
    getFlashTargets(_game, player) {
      return player.spirits
        .filter((s) => hasClash(s.cardId))
        .map((s) => ({ uid: s.uid, label: `${s.name} (+3000 BP)` }));
    },
    flash(game, player, targetUid) {
      const s = player.spirits.find((sp) => sp.uid === targetUid);
      if (!s) return;
      s.bpBoost = (s.bpBoost ?? 0) + 3000;
      s._extraLifeReductionOnWin = true;
      game.addLog(`Vermillion Roar: ${s.name} +3000 BP; extra life reduction if blocker destroyed.`);
    },
  },

  // RBS01 Purple: SkullBlast — destroy own Dark Puce → send 2 cores from opposing spirit
  rbs01112SkullBlast: {
    getFlashTargets(_game, player) {
      return player.spirits
        .filter((s) => isDarkPuce(s.cardId))
        .map((s) => ({ uid: s.uid, label: `${s.name} (destroy self)` }));
    },
    flash(game, player, targetUid) {
      const own = player.spirits.find((s) => s.uid === targetUid);
      if (!own) return;
      game._destroyOwnSpirit(player, own.uid);
      const opp = game._opp(player);
      const targets = opp.spirits.filter((s) => s.cores.normal >= 1 && !s._magicImmune);
      if (!targets.length) { game.addLog(`Skull Blast: no opposing spirit with cores.`); return; }
      if (player.isAi) {
        const best = [...targets].sort((a, b) => b.cores.normal - a.cores.normal)[0];
        game._sendCores(opp, best.uid, 2);
        game.addLog(`Skull Blast: sent 2 cores from ${best.name}.`);
      } else {
        const attackerUid = game.awaitingFlash?.attackerUid ?? null;
        game.awaitingEffect = { type: "sendCoreFromSpirit", label: `Skull Blast: Send 2 cores from opposing Spirit`, sourceUid: own.uid, ownerId: player.id, validTargets: targets.map((t) => t.uid), optional: false, pendingBattleAttackerUid: attackerUid };
      }
    },
  },

  // RBS01 Purple: Awakening — summon Purple spirit (no effects) from Trash; destroy at battle end
  rbs01113Awakening: {
    getFlashTargets(_game, player) {
      return player.trash
        .filter((id) => CARD_POOL[id]?.color === "purple" && CARD_POOL[id]?.type === "spirit" && (!CARD_POOL[id]?.effects || CARD_POOL[id].effects.length === 0))
        .map((id) => ({ uid: id, label: CARD_POOL[id]?.name ?? id }));
    },
    flash(game, player, targetUid) {
      const idx = player.trash.indexOf(targetUid);
      if (idx < 0) return;
      player.trash.splice(idx, 1);
      const spirit = makeSpiritFromCard(targetUid, player.id, game.turnNumber);
      spirit._destroyAfterBattle = true;
      player.spirits.push(spirit);
      game.addLog(`Awakening: ${spirit.name} summoned from Trash (destroyed after battle).`);
    },
  },

  // RBS01 Purple: SuicideAttack — destroy own Cost≥6 Purple → destroy opposing exhausted
  rbs01114SuicideAttack: {
    getFlashTargets(_game, player) {
      return player.spirits
        .filter((s) => isDarkPuce(s.cardId) && (CARD_POOL[s.cardId]?.cost ?? 0) >= 6)
        .map((s) => ({ uid: s.uid, label: `${s.name} (destroy self)` }));
    },
    flash(game, player, targetUid) {
      const own = player.spirits.find((s) => s.uid === targetUid);
      if (!own) return;
      game._destroyOwnSpirit(player, own.uid);
      const opp = game._opp(player);
      const targets = opp.spirits.filter((s) => s.exhausted && !s._magicImmune);
      if (!targets.length) { game.addLog(`Suicide Attack: no exhausted opposing spirit.`); return; }
      if (player.isAi) {
        const best = [...targets].sort((a, b) => getEffectiveBP(b, CARD_POOL[b.cardId]) - getEffectiveBP(a, CARD_POOL[a.cardId]))[0];
        game.destroySpirit(opp, best.uid);
        game.addLog(`Suicide Attack: destroyed ${best.name}.`);
      } else {
        const attackerUid = game.awaitingFlash?.attackerUid ?? null;
        game.awaitingEffect = { type: "destroySpirit", label: `Suicide Attack: Destroy exhausted opposing Spirit`, sourceUid: own.uid, ownerId: player.id, validTargets: targets.map((t) => t.uid), optional: false, pendingBattleAttackerUid: attackerUid };
      }
    },
  },

  // RBS01 Green: WaveRide — exhaust opposing spirit → refresh own Cost≥8 OG
  rbs01115WaveRide: {
    getFlashTargets(game, player) {
      return game._opp(player).spirits
        .filter((s) => !s._magicImmune)
        .map((s) => ({ uid: s.uid, label: `${s.name} (exhaust)` }));
    },
    flash(game, player, targetUid) {
      const opp = game._opp(player);
      const t = opp.spirits.find((s) => s.uid === targetUid);
      if (t) { t.exhausted = true; game.addLog(`Wave Ride: ${t.name} exhausted.`); }
      const ogTarget = player.spirits.find((s) => isOceanicGreen(s.cardId) && (CARD_POOL[s.cardId]?.cost ?? 0) >= 8 && s.exhausted);
      if (ogTarget) { ogTarget.exhausted = false; game.addLog(`Wave Ride: ${ogTarget.name} refreshed.`); }
    },
  },

  // RBS01 Green: DoubleVortex — exhaust 2 opposing Cost≤4 spirits (auto-pick)
  rbs01116DoubleVortex: {
    getFlashTargets() { return []; },
    flash(game, player) {
      const opp = game._opp(player);
      const candidates = opp.spirits.filter((s) => (CARD_POOL[s.cardId]?.cost ?? 0) <= 4 && !s.exhausted && !s._magicImmune);
      const picked = candidates.slice(0, 2);
      picked.forEach((s) => { s.exhausted = true; });
      if (picked.length) game.addLog(`Double Vortex: exhausted ${picked.map((s) => s.name).join(", ")}.`);
      else game.addLog(`Double Vortex: no valid targets.`);
    },
  },

  // RBS01 Green: HydroForce — own OG spirit +7000 BP; draw 2 if only blocker destroyed
  rbs01117HydroForce: {
    getFlashTargets(_game, player) {
      return player.spirits
        .filter((s) => isOceanicGreen(s.cardId))
        .map((s) => ({ uid: s.uid, label: `${s.name} (+7000 BP)` }));
    },
    flash(game, player, targetUid) {
      const s = player.spirits.find((sp) => sp.uid === targetUid);
      if (!s) return;
      s.bpBoost = (s.bpBoost ?? 0) + 7000;
      s._drawTwoOnAttackWin = true;
      game.addLog(`Hydro Force: ${s.name} +7000 BP; draw 2 if blocker destroyed.`);
    },
  },

  // RBS01 White: FastTravel — refresh own White Spirit; if opposing step, +2000 BP
  rbs01118FastTravel: {
    getFlashTargets(_game, player) {
      return player.spirits
        .filter((s) => CARD_POOL[s.cardId]?.color === "white" && s.exhausted)
        .map((s) => ({ uid: s.uid, label: `${s.name} (refresh)` }));
    },
    flash(game, player, targetUid) {
      const s = player.spirits.find((sp) => sp.uid === targetUid);
      if (!s) return;
      s.exhausted = false;
      if (game.currentPlayer !== player.id) {
        s.bpBoost = (s.bpBoost ?? 0) + 2000;
        game.addLog(`Fast Travel: ${s.name} refreshed, +2000 BP (opposing step).`);
      } else {
        game.addLog(`Fast Travel: ${s.name} refreshed.`);
      }
    },
  },

  // RBS01 White: GuardEffect — target own White Spirit → magic immune this battle
  rbs01119GuardEffect: {
    getFlashTargets(_game, player) {
      return player.spirits
        .filter((s) => CARD_POOL[s.cardId]?.color === "white")
        .map((s) => ({ uid: s.uid, label: `${s.name} (magic immune)` }));
    },
    flash(game, player, targetUid) {
      const t = player.spirits.find((sp) => sp.uid === targetUid);
      if (!t) return;
      t._magicImmune = true;
      game.addLog(`Guard Effect: ${t.name} has magic immunity this battle.`);
    },
  },

  // RBS01 White: PunishGate — return ≤7000 BP to hand (deckbottom if life reduced this turn)
  rbs01120PunishGate: {
    getFlashTargets(game, player) {
      return game._opp(player).spirits
        .filter((s) => getEffectiveBP(s, CARD_POOL[s.cardId]) <= 7000 && !s._magicImmune)
        .map((s) => ({ uid: s.uid, label: `${s.name} (return)` }));
    },
    flash(game, player, targetUid) {
      const opp = game._opp(player);
      const t = opp.spirits.find((s) => s.uid === targetUid);
      if (!t) return;
      if (game._lifeReducedThisTurn) {
        game._returnToDeckBottom(opp, targetUid);
        game.addLog(`Punish Gate: ${t.name} returned to deckbottom.`);
      } else {
        game._returnToHand(opp, targetUid);
      }
    },
  },

  // RBS01 Yellow: LifeLink Flash — own spirit +2000 BP
  rbs01121LifeLink: {
    getFlashTargets(_game, player) {
      return player.spirits.map((s) => ({ uid: s.uid, label: `${s.name} (+2000 BP)` }));
    },
    flash(game, player, targetUid) {
      const s = player.spirits.find((sp) => sp.uid === targetUid);
      if (s) { s.bpBoost = (s.bpBoost ?? 0) + 2000; game.addLog(`Life Link: ${s.name} +2000 BP.`); }
    },
  },

  // RBS01 Yellow: BoltGrid — target Cost≤4 can't attack or block this turn
  rbs01122BoltGrid: {
    getFlashTargets(game, player) {
      return game._opp(player).spirits
        .filter((s) => (CARD_POOL[s.cardId]?.cost ?? 0) <= 4 && !s._magicImmune)
        .map((s) => ({ uid: s.uid, label: `${s.name} (lock)` }));
    },
    flash(game, player, targetUid) {
      const opp = game._opp(player);
      const t = opp.spirits.find((s) => s.uid === targetUid);
      if (t) { t._cantAttackThisTurn = true; t._cantBlockThisTurn = true; game.addLog(`Bolt Grid: ${t.name} can't attack or block this turn.`); }
    },
  },

  // RBS01 Yellow: ThunderShutter — own Topaz Spirit sends 1 non-soul core to Life
  rbs01123ThunderShutter: {
    getFlashTargets(_game, player) {
      return player.spirits
        .filter((s) => isTopaz(s.cardId) && s.cores.normal > 0)
        .map((s) => ({ uid: s.uid, label: `${s.name} (send core to Life)` }));
    },
    flash(game, player, targetUid) {
      const s = player.spirits.find((sp) => sp.uid === targetUid);
      if (!s || s.cores.normal <= 0) return;
      s.cores.normal -= 1;
      player.life += 1;
      game.addLog(`Thunder Shutter: ${s.name} sends 1 core → Life (${player.life}).`);
    },
  },

  // RBS01 Blue: FindTreasure Flash — own spirit +2000 BP
  rbs01124FindTreasure: {
    getFlashTargets(_game, player) {
      return player.spirits.map((s) => ({ uid: s.uid, label: `${s.name} (+2000 BP)` }));
    },
    flash(game, player, targetUid) {
      const s = player.spirits.find((sp) => sp.uid === targetUid);
      if (s) { s.bpBoost = (s.bpBoost ?? 0) + 2000; game.addLog(`Find Treasure: ${s.name} +2000 BP.`); }
    },
  },

  // RBS01 Blue: SacrificeStrike — destroy own attacking Rumble Spirit → discard Rumble N from opp deck
  rbs01125SacrificeStrike: {
    getFlashTargets(game, player) {
      const attackerUid = game.awaitingFlash?.attackerUid;
      return player.spirits
        .filter((s) => s.uid === attackerUid && hasRumble(s.cardId))
        .map((s) => ({ uid: s.uid, label: `${s.name} (destroy for Rumble)` }));
    },
    flash(game, player, targetUid) {
      const s = player.spirits.find((sp) => sp.uid === targetUid);
      if (!s) return;
      const rumbleN = s._rumbleN ?? getRumbleN(s);
      game._destroyOwnSpirit(player, s.uid);
      const opp = game._opp(player);
      if (rumbleN > 0) {
        const discarded = opp.deck.splice(0, rumbleN);
        opp.trash.push(...discarded);
        game.addLog(`Sacrifice Strike: discarded ${rumbleN} from opposing decktop.`);
      }
    },
  },

  // RBS01 Blue: MercilessBlow — destroy Cost≤5; if life reduced this turn, also destroy Cost≤3
  rbs01126MercilessBlow: {
    getFlashTargets(game, player) {
      return game._opp(player).spirits
        .filter((s) => (CARD_POOL[s.cardId]?.cost ?? 0) <= 5 && !s._magicImmune)
        .map((s) => ({ uid: s.uid, label: `${s.name} (destroy)` }));
    },
    flash(game, player, targetUid) {
      const opp = game._opp(player);
      const t = opp.spirits.find((s) => s.uid === targetUid);
      if (t) game.destroySpirit(opp, t.uid);
      if (game._lifeReducedThisTurn) {
        const bonus = opp.spirits.find((s) => (CARD_POOL[s.cardId]?.cost ?? 0) <= 3 && !s._magicImmune);
        if (bonus) { game.destroySpirit(opp, bonus.uid); game.addLog(`Merciless Blow: also destroyed ${bonus.name} (life reduced).`); }
      }
    },
  },

  // === RSD Soul Magic Flash Effects ===

  // rsd02014SoulBite [Purple] Flash: send 2 cores from target opp spirit to Reserve
  rsd02014SoulBite: {
    getFlashTargets(game, player) {
      return game._opp(player).spirits
        .filter((s) => (s.cores.normal > 0 || s.cores.soul) && !s._magicImmune)
        .map((s) => ({ uid: s.uid, label: `${s.name} (send 2 cores)` }));
    },
    flash(game, player, targetUid) {
      const opp = game._opp(player);
      const t = opp.spirits.find((s) => s.uid === targetUid);
      if (!t) return;
      game._sendCores(opp, targetUid, 2);
      game.addLog(`Soul Bite: sent 2 cores from ${t.name} to Reserve.`);
    },
  },

  // rsd03014TentacleAttack [Green] Flash: heavy exhaust target opp spirit
  rsd03014TentacleAttack: {
    getFlashTargets(game, player) {
      return game._opp(player).spirits
        .filter((s) => !s._magicImmune)
        .map((s) => ({ uid: s.uid, label: `${s.name} (heavy exhaust)` }));
    },
    flash(game, player, targetUid) {
      const opp = game._opp(player);
      const t = opp.spirits.find((s) => s.uid === targetUid);
      if (!t) return;
      t.exhausted = true;
      t._heavyExhausted = true;
      game.addLog(`Tentacle Attack: heavy exhausted ${t.name}.`);
    },
  },

  // rsd04014DefensiveGate [White] Flash: target opp spirit can't reduce life this turn;
  // if life already reduced this turn, protect from a 2nd spirit
  rsd04014DefensiveGate: {
    getFlashTargets(game, player) {
      return game._opp(player).spirits
        .filter((s) => !s._magicImmune)
        .map((s) => ({ uid: s.uid, label: `${s.name} (prevent life reduction)` }));
    },
    flash(game, player, targetUid) {
      const opp = game._opp(player);
      const t = opp.spirits.find((s) => s.uid === targetUid);
      if (t) { t._cantReduceLife = true; game.addLog(`Defensive Gate: ${t.name} can't reduce life this turn.`); }
      if (game._lifeReducedThisTurn) {
        const remaining = opp.spirits.filter((s) => s.uid !== targetUid && !s._cantReduceLife);
        if (!remaining.length) return;
        if (player.isAi) {
          remaining[0]._cantReduceLife = true;
          game.addLog(`Defensive Gate: ${remaining[0].name} also can't reduce life this turn.`);
        } else {
          game.awaitingEffect = {
            type: "defensiveGateSecond",
            label: "Defensive Gate: Protect from a 2nd Spirit",
            ownerId: player.id,
            validTargets: remaining.map((s) => s.uid),
            optional: false,
            pendingBattleAttackerUid: game.awaitingFlash?.attackerUid ?? null,
          };
        }
      }
    },
  },

  // rsd05011FirePillar [Yellow] Flash: -2000 BP to target opp spirit, destroy if 0 BP
  rsd05011FirePillar: {
    getFlashTargets(game, player) {
      return game._opp(player).spirits
        .filter((s) => !s._magicImmune)
        .map((s) => ({ uid: s.uid, label: `${s.name} (-2000 BP)` }));
    },
    flash(game, player, targetUid) {
      const opp = game._opp(player);
      const t = opp.spirits.find((s) => s.uid === targetUid);
      if (!t) return;
      game._bpDamage(opp, targetUid, 2000);
      game.addLog(`Fire Pillar: ${t.name} -2000 BP.`);
    },
  },

  // rsd05012RebirthThunder [Yellow] Flash: -2000 BP to target opp spirit, destroy if 0 BP
  rsd05012RebirthThunder: {
    getFlashTargets(game, player) {
      return game._opp(player).spirits
        .filter((s) => !s._magicImmune)
        .map((s) => ({ uid: s.uid, label: `${s.name} (-2000 BP)` }));
    },
    flash(game, player, targetUid) {
      const opp = game._opp(player);
      const t = opp.spirits.find((s) => s.uid === targetUid);
      if (!t) return;
      game._bpDamage(opp, targetUid, 2000);
      game.addLog(`Rebirth Thunder: ${t.name} -2000 BP.`);
    },
  },

  // rsd05013Nestling [Yellow] Flash: +3000 BP to own spirit
  rsd05013Nestling: {
    getFlashTargets(_game, player) {
      return player.spirits.map((s) => ({ uid: s.uid, label: `${s.name} (+3000 BP)` }));
    },
    flash(game, player, targetUid) {
      const s = player.spirits.find((sp) => sp.uid === targetUid);
      if (s) { s.bpBoost = (s.bpBoost ?? 0) + 3000; game.addLog(`Nestling: ${s.name} +3000 BP.`); }
    },
  },

  // rsd05014TripleThunder [Yellow] Flash: -2000 BP x3 to target opp spirit, destroy if 0 BP
  rsd05014TripleThunder: {
    getFlashTargets(game, player) {
      return game._opp(player).spirits
        .filter((s) => !s._magicImmune)
        .map((s) => ({ uid: s.uid, label: `${s.name} (-6000 BP)` }));
    },
    flash(game, player, targetUid) {
      const opp = game._opp(player);
      const t = opp.spirits.find((s) => s.uid === targetUid);
      if (!t) return;
      game._bpDamage(opp, targetUid, 2000);
      game._bpDamage(opp, targetUid, 2000);
      game._bpDamage(opp, targetUid, 2000);
      game.addLog(`Triple Thunder: ${t.name} -2000 BP x3.`);
    },
  },

  // rsd06013StemLance [Blue] Flash: destroy target opp Cost≤4 Spirit
  // (nexus sacrifice bonus simplified — standard: Cost≤4 only)
  rsd06013StemLance: {
    getFlashTargets(game, player) {
      return game._opp(player).spirits
        .filter((s) => (CARD_POOL[s.cardId]?.cost ?? 0) <= 4 && !s._magicImmune)
        .map((s) => ({ uid: s.uid, label: `${s.name} (destroy)` }));
    },
    flash(game, player, targetUid) {
      const opp = game._opp(player);
      const t = opp.spirits.find((s) => s.uid === targetUid);
      if (t) { game.destroySpirit(opp, t.uid); game.addLog(`Stem Lance: destroyed ${t.name}.`); }
    },
  },

  // rsd02011DarkHang [Purple] Flash: +2000 BP to own spirit
  rsd02011DarkHang: {
    getFlashTargets(_game, player) {
      return player.spirits.map((s) => ({ uid: s.uid, label: `${s.name} (+2000 BP)` }));
    },
    flash(game, player, targetUid) {
      const s = player.spirits.find((sp) => sp.uid === targetUid);
      if (s) { s.bpBoost = (s.bpBoost ?? 0) + 2000; game.addLog(`Dark Hang: ${s.name} +2000 BP.`); }
    },
  },

  // rsd02012BloodSip [Purple] Flash: send cores from opp spirit to Reserve, keep 1
  rsd02012BloodSip: {
    getFlashTargets(game, player) {
      return game._opp(player).spirits
        .filter((s) => s.cores.normal >= 1 && !s._magicImmune)
        .map((s) => ({ uid: s.uid, label: `${s.name} (send cores)` }));
    },
    flash(game, player, targetUid) {
      const opp = game._opp(player);
      const t = opp.spirits.find((s) => s.uid === targetUid);
      if (!t) return;
      const coresSent = t.cores.normal - 1;
      opp.reserve.normal += coresSent;
      t.cores.normal = 1;
      game.addLog(`Blood Sip: sent ${coresSent} core(s) from ${t.name} to Reserve.`);
    },
  },

  // rsd02013RainyPoison [Purple] Flash: +2000 BP, plus conditional life reduce protection
  rsd02013RainyPoison: {
    getFlashTargets(_game, player) {
      return player.spirits.map((s) => ({ uid: s.uid, label: `${s.name} (+2000 BP)` }));
    },
    flash(game, player, targetUid) {
      const s = player.spirits.find((sp) => sp.uid === targetUid);
      if (s) {
        s.bpBoost = (s.bpBoost ?? 0) + 2000;
        if (game._lifeReducedThisTurn) {
          s._rainyPoisonProtect = true;
        }
        game.addLog(`Rainy Poison: ${s.name} +2000 BP.`);
      }
    },
  },

  // rsd03012HandMolt [Blue] Flash: +2000 BP to own spirit
  rsd03012HandMolt: {
    getFlashTargets(_game, player) {
      return player.spirits.map((s) => ({ uid: s.uid, label: `${s.name} (+2000 BP)` }));
    },
    flash(game, player, targetUid) {
      const s = player.spirits.find((sp) => sp.uid === targetUid);
      if (s) { s.bpBoost = (s.bpBoost ?? 0) + 2000; game.addLog(`Hand Molt: ${s.name} +2000 BP.`); }
    },
  },

  // rsd03013VortexShave [Blue] Flash: exhaust target opposing spirit
  rsd03013VortexShave: {
    getFlashTargets(game, player) {
      return game._opp(player).spirits
        .filter((s) => !s.exhausted && !s._magicImmune)
        .map((s) => ({ uid: s.uid, label: `${s.name} (exhaust)` }));
    },
    flash(game, player, targetUid) {
      const opp = game._opp(player);
      const t = opp.spirits.find((s) => s.uid === targetUid);
      if (t) { t.exhausted = true; game.addLog(`Vortex Shave: exhausted ${t.name}.`); }
    },
  },

  // rsd04012RockDrilling [White] Flash: +3000 BP to own spirit
  rsd04012RockDrilling: {
    getFlashTargets(_game, player) {
      return player.spirits.map((s) => ({ uid: s.uid, label: `${s.name} (+3000 BP)` }));
    },
    flash(game, player, targetUid) {
      const s = player.spirits.find((sp) => sp.uid === targetUid);
      if (s) { s.bpBoost = (s.bpBoost ?? 0) + 3000; game.addLog(`Rock Drilling: ${s.name} +3000 BP.`); }
    },
  },

  // rsd04013DreamRotor [White] Flash: return target opp spirit ≤5000 BP to hand
  rsd04013DreamRotor: {
    getFlashTargets(game, player) {
      return game._opp(player).spirits
        .filter((s) => getEffectiveBP(s, CARD_POOL[s.cardId]) <= 5000 && !s._magicImmune)
        .map((s) => ({ uid: s.uid, label: `${s.name} (return to hand)` }));
    },
    flash(game, player, targetUid) {
      const opp = game._opp(player);
      const idx = opp.spirits.findIndex((s) => s.uid === targetUid);
      if (idx < 0) return;
      const s = opp.spirits.splice(idx, 1)[0];
      opp.hand.push(s.cardId);
      opp.reserve.normal += s.cores.normal;
      if (s.cores.soul) opp.reserve.soul = true;
      game.addLog(`Dream Rotor: returned ${s.name} to ${opp.name}'s hand.`);
    },
  },

  // rsd06012FeedingDraw [Blue] Flash: +3000 BP to own spirit
  rsd06012FeedingDraw: {
    getFlashTargets(_game, player) {
      return player.spirits.map((s) => ({ uid: s.uid, label: `${s.name} (+3000 BP)` }));
    },
    flash(game, player, targetUid) {
      const s = player.spirits.find((sp) => sp.uid === targetUid);
      if (s) { s.bpBoost = (s.bpBoost ?? 0) + 3000; game.addLog(`Feeding Draw: ${s.name} +3000 BP.`); }
    },
  },

  // rsd06014FullStomach [Blue] Flash: +3000 BP to own spirit
  rsd06014FullStomach: {
    getFlashTargets(_game, player) {
      return player.spirits.map((s) => ({ uid: s.uid, label: `${s.name} (+3000 BP)` }));
    },
    flash(game, player, targetUid) {
      const s = player.spirits.find((sp) => sp.uid === targetUid);
      if (s) { s.bpBoost = (s.bpBoost ?? 0) + 3000; game.addLog(`Full Stomach: ${s.name} +3000 BP.`); }
    },
  },

  // === RBS01 Nexus Effects ===

  // rbs01091TheLayeredVermilionClouds (Red Nexus)
  // [LV1-2] At end of battle of own Spirits: exhaust nexus → target Clash Spirit +2000 BP this turn
  // [LV2] True Release: blocking spirits vs Clash can't go below 1 core (_coreFloorOne, enforced in _sendCores)
  // Both effects handled in resolveBattle()

  // rbs01093TheDowndraftDragonCurrent (Red Nexus)
  // [LV1-2] Draw Step: +1 draw, return 1 card to deckbottom (onDrawStep hook below)
  // [LV2] Invoke Flash: in NEXUS_FLASH_HANDLERS
  rbs01093TheDowndraftDragonCurrent: {
    onDrawStep(game, nexus, player, level) {
      if (level < 1) return;
      draw(player, 1);
      game.addLog(`${nexus.name}: draw step +1 card.`);
      if (player.isAi) {
        if (player.hand.length > 0) player.deck.push(player.hand.pop());
      } else {
        game.awaitingEffect = {
          type: "returnHandCardToDeckBottom",
          label: `${nexus.name}: Return 1 card from Hand to deckbottom`,
          ownerId: player.id,
          validTargets: player.hand.map((_, i) => String(i)),
          optional: false,
          pendingBattleAttackerUid: null,
        };
      }
    },
  },

  // rbs01092TheFloatingGrove (Green)
  // [LV1-2] When Deployed: destroy ≤2000 BP opposing Spirit
  // [any LV] Your Attack Step: first Red Spirit that attacks +2000 BP
  rbs01092TheFloatingGrove: {
    onDeploy(game, nexus, player) {
      const opp = game._opp(player);
      const targets = opp.spirits.filter((s) => getEffectiveBP(s, CARD_POOL[s.cardId]) <= 2000);
      if (!targets.length) { game.addLog(`${nexus.name}: no ≤2000 BP opposing Spirit.`); return; }
      if (player.isAi) {
        game.destroySpirit(opp, targets[0].uid);
        game.addLog(`${nexus.name}: destroyed ${targets[0].name} (≤2000 BP).`);
      } else {
        game.awaitingEffect = {
          type: "destroySpirit", label: `${nexus.name}: Destroy opposing ≤2000 BP Spirit`,
          ownerId: player.id, validTargets: targets.map((s) => s.uid), optional: false, pendingBattleAttackerUid: null,
        };
      }
    },
    onSpiritAttack(game, nexus, _player, attacker) {
      if (nexus._grooveBoostUsed) return;
      if (CARD_POOL[attacker.cardId]?.color !== "red") return;
      nexus._grooveBoostUsed = true;
      attacker.bpBoost = (attacker.bpBoost ?? 0) + 2000;
      game.addLog(`${nexus.name}: first Red Spirit attack +2000 BP.`);
    },
  },

  // rbs01094ThePenetratingMountainRange (Purple)
  // [LV1-2] passive: Shamanism can't be blocked by Cost≤3 (enforced in _canBlock)
  // [LV2] True Release: Shamanism spirits +1000 BP when they attack
  rbs01094ThePenetratingMountainRange: {
    onSpiritAttack(game, nexus, _player, attacker) {
      const level = getCardLevel(nexus, CARD_POOL[nexus.cardId]);
      if (level < 2) return;
      if (!hasShamanism(attacker.cardId)) return;
      attacker.bpBoost = (attacker.bpBoost ?? 0) + 1000;
      game.addLog(`${nexus.name}: Shamanism Spirit +1000 BP (True Release LV2).`);
    },
  },

  // rbs01095TheHighRiseTombs (Purple)
  // [LV1-2] Invoke Main: in NEXUS_INVOKE_MAIN_HANDLERS
  // [LV2] When Shamanism spirit reduces life: draw 1
  rbs01095TheHighRiseTombs: {
    onAtkLifeReduced(game, nexus, player, attacker, level) {
      if (level < 2) return;
      if (!hasShamanism(attacker.cardId)) return;
      draw(player, 1);
      game.addLog(`${nexus.name}: Shamanism reduced life – draw 1 (LV2).`);
    },
  },

  // rbs01096HuntingTree (Purple Nexus)
  // [LV1-2] When own Bloodrouse destroyed by BP comparison: send 1 core from blocking Spirit
  // [LV2] Also draw 1 card
  // Both effects handled in resolveBattle() after atkBP < blkBP destroy

  // rbs01097TheHydroCatapult (Green)
  // [LV1-2] When Cost≥7 OG attacks: exhaust opposing Cost≤4 Spirit
  // [LV2] Cost≥7 OG Spirit +2000 BP
  rbs01097TheHydroCatapult: {
    onSpiritAttack(game, nexus, player, attacker) {
      if (!isOceanicGreen(attacker.cardId)) return;
      if ((CARD_POOL[attacker.cardId]?.cost ?? 0) < 7) return;
      const opp = game._opp(player);
      const tgt = opp.spirits.find((s) => !s.exhausted && (CARD_POOL[s.cardId]?.cost ?? 0) <= 4);
      if (tgt) { tgt.exhausted = true; game.addLog(`${nexus.name}: ${tgt.name} exhausted (Cost≤4).`); }
      const level = getCardLevel(nexus, CARD_POOL[nexus.cardId]);
      if (level >= 2) {
        attacker.bpBoost = (attacker.bpBoost ?? 0) + 2000;
        game.addLog(`${nexus.name}: OG Cost≥7 +2000 BP (LV2).`);
      }
    },
  },

  // rbs01098TheCurrentCorridor (Green)
  // [LV1-2] Invoke Flash: in NEXUS_FLASH_HANDLERS
  // [LV2] When own Current Spirit summoned: reveal 3, add OG Cost≥7 to hand
  rbs01098TheCurrentCorridor: {
    onNexusSummon(game, nexus, player, newSpirit) {
      const level = getCardLevel(nexus, CARD_POOL[nexus.cardId]);
      if (level < 2) return;
      if (!hasCurrent(newSpirit.cardId)) return;
      const revealed = player.deck.splice(0, 3);
      const pick = revealed.find((id) => isOceanicGreen(id) && (CARD_POOL[id]?.cost ?? 0) >= 7);
      if (pick) {
        player.hand.push(pick);
        player.deck.push(...revealed.filter((id) => id !== pick));
        game.addLog(`${nexus.name}: Current summoned – added ${CARD_POOL[pick]?.name} to hand.`);
      } else {
        player.deck.push(...revealed);
        game.addLog(`${nexus.name}: Current summoned – no OG Cost≥7 found.`);
      }
    },
  },

  // rbs01099TheIcebergWarship (Green)
  // [LV1-2] When Destroyed: 1 core → Reserve
  // [LV2] When own life reduced: core from Void → own Armored Fish
  rbs01099TheIcebergWarship: {
    onNexusDestroyed(game, nexus, player) {
      player.reserve.normal += 1;
      game.addLog(`${nexus.name}: destroyed – 1 core → Reserve.`);
    },
    onOwnLifeReduced(game, nexus, player, level) {
      if (level < 2) return;
      const af = player.spirits.find((s) => isArmoredFish(s.cardId));
      if (af) { af.cores.normal += 1; game.addLog(`${nexus.name}: life reduced – core → ${af.name}.`); }
    },
  },

  // rbs01100TheDualFlowDesert (White Nexus)
  // [LV1-2] Passive: Amplify spirits can't be blocked by Cost≤2 (enforced in _canBlock)
  // [LV2] True Release Once Per Turn: after Amplify battle, core from Trash to own spirit
  // Post-battle handled in resolveBattle(); block restriction in _canBlock()

  // rbs01102RockPit (White Nexus) — same as rbs01100
  // [LV1-2] Passive: Amplify spirits can't be blocked by Cost≤2 (enforced in _canBlock)
  // [LV2] True Release Once Per Turn: after Amplify battle, core from Trash to own spirit

  // rbs01101LampLine (White)
  // [LV1-2] When Destroyed: refresh up to 2 own Mineroid Spirits
  // [LV2] Cost≥6 Mineroid +1000 BP when attacking
  rbs01101LampLine: {
    onNexusDestroyed(game, nexus, player) {
      let count = 0;
      for (const s of player.spirits) {
        if (count >= 2) break;
        if (isMineroid(s.cardId) && s.exhausted) { s.exhausted = false; count += 1; game.addLog(`${nexus.name}: destroyed – ${s.name} refreshed.`); }
      }
    },
    onSpiritAttack(game, nexus, _player, attacker) {
      const level = getCardLevel(nexus, CARD_POOL[nexus.cardId]);
      if (level < 2) return;
      if (!isMineroid(attacker.cardId) || (CARD_POOL[attacker.cardId]?.cost ?? 0) < 6) return;
      attacker.bpBoost = (attacker.bpBoost ?? 0) + 1000;
      game.addLog(`${nexus.name}: Cost≥6 Mineroid +1000 BP (LV2).`);
    },
  },

  // rbs01103TheThunderEruptingMountain (Yellow)
  // [LV1-2] When use Magic: refresh an own exhausted Topaz Spirit
  rbs01103TheThunderEruptingMountain: {
    onNexusMagicPlay(game, nexus, player) {
      const t = player.spirits.find((s) => isTopaz(s.cardId) && s.exhausted);
      if (t) { t.exhausted = false; game.addLog(`${nexus.name}: magic played – ${t.name} refreshed.`); }
    },
  },

  // rbs01104TheBeastsMawLair (Yellow)
  // [LV1-2] When use Magic during flash: attacking Spirit +2000 BP
  // [LV2] When use Topaz Magic: draw 1
  rbs01104TheBeastsMawLair: {
    onNexusMagicPlay(game, nexus, player, level, magicCardId) {
      if (game.awaitingFlash?.attackerUid) {
        const atk = player.spirits.find((s) => s.uid === game.awaitingFlash.attackerUid);
        if (atk) { atk.bpBoost = (atk.bpBoost ?? 0) + 2000; game.addLog(`${nexus.name}: magic played – ${atk.name} +2000 BP.`); }
      }
      if (level >= 2 && isTopaz(magicCardId)) {
        draw(player, 1);
        game.addLog(`${nexus.name}: Topaz Magic – draw 1 (LV2).`);
      }
    },
  },

  // rbs01105TheChargingPyramid (Yellow)
  // [LV1-2] Your Attack Step: own Thunder Dragon spirits +1000 BP
  rbs01105TheChargingPyramid: {
    onStartAttackStep(game, nexus, player) {
      const tds = player.spirits.filter((s) => isThunderDragon(s.cardId));
      tds.forEach((s) => { s.bpBoost = (s.bpBoost ?? 0) + 1000; });
      if (tds.length) game.addLog(`${nexus.name}: Thunder Dragon spirits +1000 BP.`);
    },
  },

  // rbs01106TheCyanlightThornGarden (Blue)
  // [LV1-2] EX discard trigger: skip
  // [LV2] True Release: Rumble spirits +2000 BP when attacking
  rbs01106TheCyanlightThornGarden: {
    onSpiritAttack(game, nexus, _player, attacker) {
      const level = getCardLevel(nexus, CARD_POOL[nexus.cardId]);
      if (level < 2) return;
      if (!hasRumble(attacker.cardId)) return;
      attacker.bpBoost = (attacker.bpBoost ?? 0) + 2000;
      game.addLog(`${nexus.name}: Rumble Spirit +2000 BP (True Release LV2).`);
    },
  },

  // rbs01107TheSeedShoweringGiantTree (Blue)
  // [LV1-2] EX discard trigger: skip
  // [LV2] Your End Step: refresh an own Rumble Spirit
  rbs01107TheSeedShoweringGiantTree: {
    onEndStep(game, nexus, player, level) {
      if (level < 2) return;
      const t = player.spirits.find((s) => hasRumble(s.cardId) && s.exhausted);
      if (t) { t.exhausted = false; game.addLog(`${nexus.name}: End Step – ${t.name} refreshed.`); }
    },
  },

  // rbs01108TheVitalityWoods (Blue)
  // [LV1-2] When Destroyed: own Ferobeast spirits +3000 BP this turn
  rbs01108TheVitalityWoods: {
    onNexusDestroyed(game, nexus, player) {
      const fbs = player.spirits.filter((s) => isFerobeast(s.cardId));
      fbs.forEach((s) => { s.bpBoost = (s.bpBoost ?? 0) + 3000; });
      if (fbs.length) game.addLog(`${nexus.name}: destroyed – Ferobeast spirits +3000 BP.`);
    },
  },

  // === RP26 Promo Cards ===

  // rp26TheThunderEmperorDragonSiegwurm (Red, Clash)
  // [LV1-2] Clash During Attack: opposing must block if possible
  // [LV2] Your Attack Step: give all own Red Cloud spirits Clash
  rp26TheThunderEmperorDragonSiegwurm: {
    onAttack(_game, spirit, _player, _level) {
      spirit._clashActive = true;
    },
    onStartAttackStep(game, spirit, player, level) {
      if (level < 2) return;
      player.spirits.filter((s) => isRedCloud(s.cardId) && s.uid !== spirit.uid).forEach((s) => {
        s._clashActive = true;
      });
      if (player.spirits.some((s) => isRedCloud(s.cardId) && s.uid !== spirit.uid)) {
        game.addLog(`${spirit.name}: Red Cloud spirits gain Clash (LV2).`);
      }
    },
  },

  // rp26Proplematis (Green, Legacy skipped)
  // [LV2] During Attack - Once Per Turn: when only opposing destroyed via BP comparison, refresh self
  rp26Proplematis: {
    onAttackWin(game, spirit, _player, level) {
      if (level < 2) return;
      if (spirit._oncePerTurnUsed) return;
      spirit.exhausted = false;
      spirit._oncePerTurnUsed = true;
      game.addLog(`${spirit.name}: refreshed (only opposing destroyed, LV2).`);
    },
  },
};

const INVOKE_FLASH_HANDLERS = {
  rsd01007Griffar: {
    canInvoke(spirit, player) {
      return !spirit.flashUsedThisBattle && player.hand.some((id) => isWindfang(id));
    },
    invoke(game, spirit, player) {
      const indices = player.hand.map((id, i) => ({ id, i })).filter(({ id }) => isWindfang(id)).map(({ i }) => i);
      if (!indices.length) return;
      spirit.flashUsedThisBattle = true;
      if (player.isAi) {
        const [disc] = player.hand.splice(indices[0], 1);
        player.trash.push(disc);
        spirit.bpBoost = (spirit.bpBoost ?? 0) + 3000;
        game.addLog(`${spirit.name}: Invoke Flash – discarded ${CARD_POOL[disc]?.name}, +3000 BP.`);
      } else {
        game.awaitingEffect = {
          type: "discardWindfangForBP", label: `${spirit.name}: Discard a Windfang — +3000 BP`,
          sourceName: spirit.name, sourceUid: spirit.uid, ownerId: player.id,
          validTargets: indices.map(String), optional: false, pendingBattleAttackerUid: spirit.uid,
        };
      }
    },
  },
  rsd01X02TheFlyingIronAkurai: {
    canInvoke(spirit, player) {
      return !spirit.flashUsedThisBattle && player.hand.some((id) => isWindfang(id));
    },
    invoke(game, spirit, player) {
      const indices = player.hand.map((id, i) => ({ id, i })).filter(({ id }) => isWindfang(id)).map(({ i }) => i);
      if (!indices.length) return;
      spirit.flashUsedThisBattle = true;
      if (player.isAi) {
        const [disc] = player.hand.splice(indices[0], 1);
        player.trash.push(disc);
        spirit.bpBoost = (spirit.bpBoost ?? 0) + 3000;
        game.addLog(`${spirit.name}: Invoke Flash – discarded ${CARD_POOL[disc]?.name}, +3000 BP.`);
      } else {
        game.awaitingEffect = {
          type: "discardWindfangForBP", label: `${spirit.name}: Discard a Windfang — +3000 BP`,
          sourceName: spirit.name, sourceUid: spirit.uid, ownerId: player.id,
          validTargets: indices.map(String), optional: false, pendingBattleAttackerUid: spirit.uid,
        };
      }
    },
  },
  // [LV2] During Attack Invoke Flash: exhaust Ferobeast Nexus → core from Void to Trash
  rsd06004Rhiceros: {
    canInvoke(spirit, player) {
      const level = getCardLevel(spirit, CARD_POOL[spirit.cardId]);
      return level >= 2 && !spirit.flashUsedThisBattle && player.nexuses.some((n) => isFerobeast(n.cardId) && !n.exhausted);
    },
    invoke(game, spirit, player) {
      const nx = player.nexuses.find((n) => isFerobeast(n.cardId) && !n.exhausted);
      if (!nx) return;
      nx.exhausted = true;
      player.trashCore.normal += 1;
      spirit.flashUsedThisBattle = true;
      game.addLog(`${spirit.name}: Invoke Flash – exhausted ${nx.name}, core → Trash.`);
    },
  },
  // [LV2] True Release Attack Invoke Flash: refresh another Armored Fish
  rsd03X02TheDeepNestDuntekleo: {
    canInvoke(spirit, player) {
      const level = getCardLevel(spirit, CARD_POOL[spirit.cardId]);
      return level >= 2 && !spirit.flashUsedThisBattle
        && player.spirits.some((s) => isArmoredFish(s.cardId) && s.uid !== spirit.uid && s.exhausted);
    },
    invoke(game, spirit, player) {
      const fish = player.spirits.find((s) => isArmoredFish(s.cardId) && s.uid !== spirit.uid && s.exhausted);
      if (!fish) return;
      fish.exhausted = false;
      spirit.flashUsedThisBattle = true;
      game.addLog(`${spirit.name}: Invoke Flash – ${fish.name} refreshed.`);
    },
  },

  // RBS01 Red: rbs01X01 LV2 True Release Invoke Flash: allow opposing exhausted spirit to block
  rbs01X01TheRedWitchRestiel: {
    canInvoke(spirit, _player) {
      const level = getCardLevel(spirit, CARD_POOL[spirit.cardId]);
      return level >= 2 && !spirit.flashUsedThisBattle;
    },
    invoke(game, spirit, _player) {
      spirit._forceExhaustedBlock = true;
      spirit.flashUsedThisBattle = true;
      game.addLog(`${spirit.name}: Invoke Flash – opposing exhausted Spirit may block.`);
    },
  },
  // RBS01 Red: rbs01012Regulinaz [LV1-2] Invoke Flash: discard Windfang → +3000 BP
  rbs01012Regulinaz: {
    canInvoke(spirit, player) {
      return !spirit.flashUsedThisBattle && player.hand.some((id) => isWindfang(id));
    },
    invoke(game, spirit, player) {
      const indices = player.hand.map((id, i) => ({ id, i })).filter(({ id }) => isWindfang(id)).map(({ i }) => i);
      if (!indices.length) return;
      spirit.flashUsedThisBattle = true;
      if (player.isAi) {
        const [disc] = player.hand.splice(indices[0], 1);
        player.trash.push(disc);
        spirit.bpBoost = (spirit.bpBoost ?? 0) + 3000;
        game.addLog(`${spirit.name}: Invoke Flash – discarded ${CARD_POOL[disc]?.name}, +3000 BP.`);
      } else {
        game.awaitingEffect = {
          type: "discardWindfangForBP", label: `${spirit.name}: Discard a Windfang — +3000 BP`,
          sourceName: spirit.name, sourceUid: spirit.uid, ownerId: player.id,
          validTargets: indices.map(String), optional: false, pendingBattleAttackerUid: spirit.uid,
        };
      }
    },
  },
  // RBS01 Red: rbs01013Thorel [LV2] True Release Invoke Flash: discard Windfang → +3000 BP
  rbs01013Thorel: {
    canInvoke(spirit, player) {
      const level = getCardLevel(spirit, CARD_POOL[spirit.cardId]);
      return level >= 2 && !spirit.flashUsedThisBattle && player.hand.some((id) => isWindfang(id));
    },
    invoke(game, spirit, player) {
      const indices = player.hand.map((id, i) => ({ id, i })).filter(({ id }) => isWindfang(id)).map(({ i }) => i);
      if (!indices.length) return;
      spirit.flashUsedThisBattle = true;
      if (player.isAi) {
        const [disc] = player.hand.splice(indices[0], 1);
        player.trash.push(disc);
        spirit.bpBoost = (spirit.bpBoost ?? 0) + 3000;
        game.addLog(`${spirit.name}: Invoke Flash – discarded ${CARD_POOL[disc]?.name}, +3000 BP.`);
      } else {
        game.awaitingEffect = {
          type: "discardWindfangForBP", label: `${spirit.name}: Discard a Windfang — +3000 BP`,
          sourceName: spirit.name, sourceUid: spirit.uid, ownerId: player.id,
          validTargets: indices.map(String), optional: false, pendingBattleAttackerUid: spirit.uid,
        };
      }
    },
  },

  // RBS01 Green: Current Invoke Flash spirits — exhaust self → target own Cost≥8 OG spirit, +1000 BP
  rbs01035Alotoll: {
    canInvoke(spirit, player) {
      const level = getCardLevel(spirit, CARD_POOL[spirit.cardId]);
      return level >= 2 && !spirit.flashUsedThisBattle && !spirit.exhausted
        && player.spirits.some((s) => isOceanicGreen(s.cardId) && (CARD_POOL[s.cardId]?.cost ?? 0) >= 8 && s.uid !== spirit.uid);
    },
    invoke(game, spirit, player) {
      const target = player.spirits.find((s) => isOceanicGreen(s.cardId) && (CARD_POOL[s.cardId]?.cost ?? 0) >= 8 && s.uid !== spirit.uid);
      if (!target) return;
      spirit.exhausted = true;
      target.bpBoost = (target.bpBoost ?? 0) + 1000;
      spirit.flashUsedThisBattle = true;
      game.addLog(`${spirit.name}: Current Invoke Flash – ${target.name} +1000 BP.`);
    },
  },
  rbs01038Gaviadile: {
    canInvoke(spirit, player) {
      return !spirit.flashUsedThisBattle && !spirit.exhausted
        && player.spirits.some((s) => isOceanicGreen(s.cardId) && (CARD_POOL[s.cardId]?.cost ?? 0) >= 8 && s.uid !== spirit.uid);
    },
    invoke(game, spirit, player) {
      const target = player.spirits.find((s) => isOceanicGreen(s.cardId) && (CARD_POOL[s.cardId]?.cost ?? 0) >= 8 && s.uid !== spirit.uid);
      if (!target) return;
      spirit.exhausted = true;
      target.bpBoost = (target.bpBoost ?? 0) + 1000;
      spirit.flashUsedThisBattle = true;
      game.addLog(`${spirit.name}: Current Invoke Flash – ${target.name} +1000 BP.`);
    },
  },
  rbs01040Carnabera: {
    canInvoke(spirit, player) {
      return !spirit.flashUsedThisBattle && !spirit.exhausted
        && player.spirits.some((s) => isOceanicGreen(s.cardId) && (CARD_POOL[s.cardId]?.cost ?? 0) >= 8 && s.uid !== spirit.uid);
    },
    invoke(game, spirit, player) {
      const target = player.spirits.find((s) => isOceanicGreen(s.cardId) && (CARD_POOL[s.cardId]?.cost ?? 0) >= 8 && s.uid !== spirit.uid);
      if (!target) return;
      spirit.exhausted = true;
      target.bpBoost = (target.bpBoost ?? 0) + 1000;
      spirit.flashUsedThisBattle = true;
      game.addLog(`${spirit.name}: Current Invoke Flash – ${target.name} +1000 BP.`);
    },
  },
  rbs01041NaNascita: {
    canInvoke(spirit, player) {
      return !spirit.flashUsedThisBattle && !spirit.exhausted
        && player.spirits.some((s) => isOceanicGreen(s.cardId) && (CARD_POOL[s.cardId]?.cost ?? 0) >= 8 && s.uid !== spirit.uid);
    },
    invoke(game, spirit, player) {
      const target = player.spirits.find((s) => isOceanicGreen(s.cardId) && (CARD_POOL[s.cardId]?.cost ?? 0) >= 8 && s.uid !== spirit.uid);
      if (!target) return;
      spirit.exhausted = true;
      target.bpBoost = (target.bpBoost ?? 0) + 1000;
      spirit.flashUsedThisBattle = true;
      game.addLog(`${spirit.name}: Current Invoke Flash – ${target.name} +1000 BP.`);
    },
  },
  rbs01X08MermaidjaPrincess: {
    canInvoke(spirit, player) {
      const level = getCardLevel(spirit, CARD_POOL[spirit.cardId]);
      return level >= 2 && !spirit.flashUsedThisBattle && !spirit.exhausted
        && player.spirits.some((s) => isOceanicGreen(s.cardId) && (CARD_POOL[s.cardId]?.cost ?? 0) >= 8 && s.uid !== spirit.uid);
    },
    invoke(game, spirit, player) {
      const target = player.spirits.find((s) => isOceanicGreen(s.cardId) && (CARD_POOL[s.cardId]?.cost ?? 0) >= 8 && s.uid !== spirit.uid);
      if (!target) return;
      spirit.exhausted = true;
      target.bpBoost = (target.bpBoost ?? 0) + 1000;
      spirit.flashUsedThisBattle = true;
      game.addLog(`${spirit.name}: Current Invoke Flash – ${target.name} +1000 BP.`);
    },
  },
  // RBS01 Green X09: [LV2] During Attack Invoke Flash: refresh target Current spirit, can't attack this turn
  rbs01X09TheDeepBlowWhala: {
    canInvoke(spirit, player) {
      const level = getCardLevel(spirit, CARD_POOL[spirit.cardId]);
      return level >= 2 && !spirit.flashUsedThisBattle
        && player.spirits.some((s) => hasCurrent(s.cardId) && s.exhausted && s.uid !== spirit.uid);
    },
    invoke(game, spirit, player) {
      const target = player.spirits.find((s) => hasCurrent(s.cardId) && s.exhausted && s.uid !== spirit.uid);
      if (!target) return;
      target.exhausted = false;
      target._cantAttackThisTurn = true;
      spirit.flashUsedThisBattle = true;
      game.addLog(`${spirit.name}: Invoke Flash – ${target.name} refreshed (can't attack this turn).`);
    },
  },

  // RBS01 White: Amplify Invoke Flash spirits — pay 1 core → +1000 per Leucomyst you control
  rbs01050Claydoro: {
    canInvoke(spirit, player) {
      const level = getCardLevel(spirit, CARD_POOL[spirit.cardId]);
      return level >= 2 && !spirit.flashUsedThisBattle && player.reserve.normal >= 1;
    },
    invoke(game, spirit, player) {
      player.reserve.normal -= 1;
      const count = player.spirits.filter((s) => isLeucomyst(s.cardId)).length;
      spirit.bpBoost = (spirit.bpBoost ?? 0) + count * 1000;
      spirit.flashUsedThisBattle = true;
      game.addLog(`${spirit.name}: Amplify Invoke Flash – paid 1 core, +${count * 1000} BP (${count} Leucomyst).`);
    },
  },
  rbs01051Meztaurus: {
    canInvoke(spirit, player) {
      return !spirit.flashUsedThisBattle && player.reserve.normal >= 1;
    },
    invoke(game, spirit, player) {
      player.reserve.normal -= 1;
      const count = player.spirits.filter((s) => isLeucomyst(s.cardId)).length;
      spirit.bpBoost = (spirit.bpBoost ?? 0) + count * 1000;
      spirit.flashUsedThisBattle = true;
      game.addLog(`${spirit.name}: Amplify Invoke Flash – paid 1 core, +${count * 1000} BP (${count} Leucomyst).`);
    },
  },
  rbs01056Stelgatgun: {
    canInvoke(spirit, player) {
      return !spirit.flashUsedThisBattle && player.reserve.normal >= 1;
    },
    invoke(game, spirit, player) {
      player.reserve.normal -= 1;
      const count = player.spirits.filter((s) => isLeucomyst(s.cardId)).length;
      spirit.bpBoost = (spirit.bpBoost ?? 0) + count * 1000;
      spirit.flashUsedThisBattle = true;
      game.addLog(`${spirit.name}: Amplify Invoke Flash – paid 1 core, +${count * 1000} BP (${count} Leucomyst).`);
    },
  },
  rbs01057HopliShimmer: {
    canInvoke(spirit, player) {
      return !spirit.flashUsedThisBattle && player.reserve.normal >= 1;
    },
    invoke(game, spirit, player) {
      player.reserve.normal -= 1;
      const count = player.spirits.filter((s) => isLeucomyst(s.cardId)).length;
      spirit.bpBoost = (spirit.bpBoost ?? 0) + count * 1000;
      spirit.flashUsedThisBattle = true;
      game.addLog(`${spirit.name}: Amplify Invoke Flash – paid 1 core, +${count * 1000} BP (${count} Leucomyst).`);
    },
  },
  rbs01059TheHollowRadiancePeppersDragon: {
    canInvoke(spirit, player) {
      const level = getCardLevel(spirit, CARD_POOL[spirit.cardId]);
      return level >= 2 && !spirit.flashUsedThisBattle && player.reserve.normal >= 1;
    },
    invoke(game, spirit, player) {
      player.reserve.normal -= 1;
      const count = player.spirits.filter((s) => isLeucomyst(s.cardId)).length;
      spirit.bpBoost = (spirit.bpBoost ?? 0) + count * 1000;
      spirit.flashUsedThisBattle = true;
      game.addLog(`${spirit.name}: Amplify Invoke Flash – paid 1 core, +${count * 1000} BP (${count} Leucomyst).`);
    },
  },
  rbs01060Mudoro: {
    canInvoke(spirit, player) {
      return !spirit.flashUsedThisBattle && player.reserve.normal >= 1;
    },
    invoke(game, spirit, player) {
      player.reserve.normal -= 1;
      const count = player.spirits.filter((s) => isLeucomyst(s.cardId)).length;
      spirit.bpBoost = (spirit.bpBoost ?? 0) + count * 1000;
      spirit.flashUsedThisBattle = true;
      game.addLog(`${spirit.name}: Amplify Invoke Flash – paid 1 core, +${count * 1000} BP (${count} Leucomyst).`);
    },
  },
  rbs01X11TheArgentIronDukeLarsBeriberg: {
    canInvoke(spirit, player) {
      return !spirit.flashUsedThisBattle && player.reserve.normal >= 1;
    },
    invoke(game, spirit, player) {
      player.reserve.normal -= 1;
      const count = player.spirits.filter((s) => isLeucomyst(s.cardId)).length;
      spirit.bpBoost = (spirit.bpBoost ?? 0) + count * 1000;
      spirit.flashUsedThisBattle = true;
      game.addLog(`${spirit.name}: Amplify Invoke Flash – paid 1 core, +${count * 1000} BP (${count} Leucomyst).`);
    },
  },

  // RBS01 Yellow: Magirrate Invoke Flash — use a Topaz family Magic Flash effect from hand for free
  // Shared logic via _magirrateInvoke helper below the handlers object
  rbs01072Thunderai: {
    canInvoke(spirit, player) {
      const level = getCardLevel(spirit, CARD_POOL[spirit.cardId]);
      if (level < 2 || spirit.flashUsedThisBattle) return false;
      return player.hand.some(
        (id) => isTopaz(id) && CARD_POOL[id]?.type === "magic"
          && CARD_POOL[id]?.effects?.some((e) => e.condition === "Flash"),
      );
    },
    invoke(game, spirit, player) {
      spirit.flashUsedThisBattle = true;
      _magirrateInvoke(game, spirit, player);
    },
  },
  rbs01075Potariwa: {
    canInvoke(spirit, player) {
      if (spirit.flashUsedThisBattle) return false;
      return player.hand.some(
        (id) => isTopaz(id) && CARD_POOL[id]?.type === "magic"
          && CARD_POOL[id]?.effects?.some((e) => e.condition === "Flash"),
      );
    },
    invoke(game, spirit, player) {
      spirit.flashUsedThisBattle = true;
      _magirrateInvoke(game, spirit, player);
    },
  },
  rbs01X15TheReturningThunderEmbalmimer: {
    canInvoke(spirit, player) {
      if (spirit.flashUsedThisBattle) return false;
      return player.hand.some(
        (id) => isTopaz(id) && CARD_POOL[id]?.type === "magic"
          && CARD_POOL[id]?.effects?.some((e) => e.condition === "Flash"),
      );
    },
    invoke(game, spirit, player) {
      spirit.flashUsedThisBattle = true;
      _magirrateInvoke(game, spirit, player);
    },
  },

  // RBS01 Blue: rbs01090TheAzureGaitBalpnir [LV2] During Attack Invoke Flash: exhaust Cyantree Nexus → destroy Cost≤4
  rbs01090TheAzureGaitBalpnir: {
    canInvoke(spirit, player) {
      const level = getCardLevel(spirit, CARD_POOL[spirit.cardId]);
      return level >= 2 && !spirit.flashUsedThisBattle
        && player.nexuses.some((n) => isCyantree(n.cardId) && !n.exhausted);
    },
    invoke(game, spirit, player) {
      const nx = player.nexuses.find((n) => isCyantree(n.cardId) && !n.exhausted);
      if (!nx) return;
      nx.exhausted = true;
      spirit.flashUsedThisBattle = true;
      const opp = game._opp(player);
      const targets = opp.spirits.filter((s) => (CARD_POOL[s.cardId]?.cost ?? 0) <= 4);
      if (!targets.length) { game.addLog(`${spirit.name}: Invoke Flash – no Cost≤4 target.`); return; }
      const attackerUid = game.awaitingFlash?.attackerUid ?? null;
      if (player.isAi) {
        const best = [...targets].sort((a, b) => getEffectiveBP(b, CARD_POOL[b.cardId]) - getEffectiveBP(a, CARD_POOL[a.cardId]))[0];
        game.destroySpirit(opp, best.uid);
        game.addLog(`${spirit.name}: Invoke Flash – destroyed ${best.name}.`);
      } else {
        game.awaitingEffect = { type: "destroySpirit", label: `${spirit.name}: Destroy opposing Cost≤4 Spirit`, sourceUid: spirit.uid, ownerId: player.id, validTargets: targets.map((t) => t.uid), optional: false, pendingBattleAttackerUid: attackerUid };
      }
    },
  },
};

// Shared Magirrate invoke: AI auto-executes first available Topaz flash magic;
// human player gets awaitingEffect to pick card (and then target if needed).
function _magirrateInvoke(game, spirit, player) {
  const topazFlash = player.hand.reduce((acc, id, i) => {
    if (isTopaz(id) && CARD_POOL[id]?.type === "magic"
      && CARD_POOL[id]?.effects?.some((e) => e.condition === "Flash")) acc.push({ id, i });
    return acc;
  }, []);
  if (!topazFlash.length) return;
  if (player.isAi) {
    const { id: cardId, i: idx } = topazFlash[0];
    const handler = MAGIC_FLASH_EFFECTS[cardId];
    const targets = handler?.getFlashTargets?.(game, player) ?? [];
    const targetUid = targets.length > 0 ? targets[0].uid : null;
    player.hand.splice(idx, 1);
    player.trash.push(cardId);
    game.addLog(`${spirit.name}: Magirrate – ${CARD_POOL[cardId]?.name} (Flash, free).`);
    handler?.flash?.(game, player, targetUid);
    player._usedTopazMagicThisTurn = true;
    player.spirits.forEach((s) => {
      CARD_EFFECTS[s.cardId]?.onMagicPlay?.(game, s, player, getCardLevel(s, CARD_POOL[s.cardId]), cardId);
    });
    player.nexuses.forEach((n) => {
      CARD_EFFECTS[n.cardId]?.onNexusMagicPlay?.(game, n, player, getCardLevel(n, CARD_POOL[n.cardId]), cardId);
    });
  } else {
    game.awaitingEffect = {
      type: "magirrateMagic",
      label: `${spirit.name}: Magirrate – Use Topaz Magic Flash for free`,
      ownerId: player.id,
      validTargets: topazFlash.map(({ i }) => String(i)),
      optional: false,
      pendingBattleAttackerUid: null,
    };
  }
}

const NEXUS_FLASH_HANDLERS = {
  rsd01010UtmostDepthTheWindfangCrag: {
    canInvoke(nexus, player, attackerUid) {
      if (nexus.exhausted) return false;
      const atk = player.spirits.find((s) => s.uid === attackerUid);
      return atk && isWindfang(atk.cardId);
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

  // rbs01098TheCurrentCorridor [LV1-2] Invoke Flash: exhaust → attacking Current spirit +2000 BP
  rbs01098TheCurrentCorridor: {
    canInvoke(nexus, player, attackerUid) {
      if (nexus.exhausted) return false;
      const atk = player.spirits.find((s) => s.uid === attackerUid);
      return atk && hasCurrent(atk.cardId);
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

  // rsd02009UtmostDepthBloodrouseMountainRange [LV1-2] Invoke Flash: exhaust → attacking Bloodrouse spirit +2000 BP
  rsd02009UtmostDepthBloodrouseMountainRange: {
    canInvoke(nexus, player, attackerUid) {
      if (nexus.exhausted) return false;
      const atk = player.spirits.find((s) => s.uid === attackerUid);
      return atk && isBloodrouse(atk.cardId);
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

  // rbs01093TheDowndraftDragonCurrent [LV2] Invoke Flash: exhaust → attacking Clash spirit +3000 BP this battle
  rbs01093TheDowndraftDragonCurrent: {
    canInvoke(nexus, player, attackerUid) {
      if (nexus.exhausted) return false;
      const level = getCardLevel(nexus, CARD_POOL[nexus.cardId]);
      if (level < 2) return false;
      const atk = player.spirits.find((s) => s.uid === attackerUid);
      return atk && hasClash(atk.cardId);
    },
    invoke(game, nexus, player, attackerUid) {
      nexus.exhausted = true;
      const atk = player.spirits.find((s) => s.uid === attackerUid);
      if (atk) {
        atk.bpBoost = (atk.bpBoost ?? 0) + 3000;
        game.addLog(`${nexus.name}: Invoke Flash – ${atk.name} +3000 BP this battle.`);
      }
    },
  },
};

// --- Invoke Main handlers (spirits) ---

const INVOKE_MAIN_HANDLERS = {
  rsd04003Arsinus: {
    canInvoke(spirit) { return !spirit.exhausted; },
    invoke(game, spirit, player) {
      spirit.exhausted = true;
      const revealed = player.deck.splice(0, 2);
      const pick = revealed.find((id) => isMineroid(id) && CARD_POOL[id]?.type === "spirit" && (CARD_POOL[id]?.cost ?? 0) >= 6);
      if (pick) { player.hand.push(pick); player.deck.push(...revealed.filter((id) => id !== pick)); game.addLog(`${spirit.name}: Invoke Main → ${CARD_POOL[pick]?.name}.`); }
      else { player.deck.push(...revealed); game.addLog(`${spirit.name}: Invoke Main – no Cost ≥6 Mineroid found.`); }
    },
  },

  // RBS01 Purple: rbs01027LebenLeichnam [LV2] Invoke Main: destroy self → return Dark Puce from Trash
  rbs01027LebenLeichnam: {
    canInvoke(spirit) {
      const level = getCardLevel(spirit, CARD_POOL[spirit.cardId]);
      return level >= 2;
    },
    invoke(game, spirit, player) {
      const pick = player.trash.find((id) => isDarkPuce(id) && CARD_POOL[id]?.type === "spirit");
      game._destroyOwnSpirit(player, spirit.uid);
      if (pick) {
        const idx = player.trash.lastIndexOf(pick);
        player.trash.splice(idx, 1);
        player.hand.push(pick);
        game.addLog(`Leben-Leichnam: Invoke Main – returned ${CARD_POOL[pick]?.name} to Hand.`);
      } else {
        game.addLog(`Leben-Leichnam: Invoke Main – no Dark Puce in Trash.`);
      }
    },
  },

  // RBS01 Yellow: rbs01063BoltSheep [LV1-2] Invoke Main: if own exhausted Topaz, destroy self → core to Reserve
  rbs01063BoltSheep: {
    canInvoke(spirit, player) {
      return player.spirits.some((s) => s.uid !== spirit.uid && isTopaz(s.cardId) && s.exhausted);
    },
    invoke(game, spirit, player) {
      game._destroyOwnSpirit(player, spirit.uid);
      player.reserve.normal += 1;
      game.addLog(`Bolt Sheep: Invoke Main – destroyed self, 1 core → Reserve.`);
    },
  },

  // RBS01 Yellow: rbs01X13TheMageKingPuppetIgleMitas [LV1-2] Invoke Main: exhaust self → reveal 2, add Echochant to hand
  rbs01X13TheMageKingPuppetIgleMitas: {
    canInvoke(spirit) { return !spirit.exhausted; },
    invoke(game, spirit, player) {
      spirit.exhausted = true;
      const revealed = player.deck.splice(0, 2);
      const pick = revealed.find((id) => isEchochant(id));
      if (pick) {
        player.hand.push(pick);
        player.deck.push(...revealed.filter((id) => id !== pick));
        game.addLog(`${spirit.name}: Invoke Main → ${CARD_POOL[pick]?.name}.`);
      } else {
        player.deck.push(...revealed);
        game.addLog(`${spirit.name}: Invoke Main – no Echochant found.`);
      }
    },
  },
};

// --- Nexus Invoke Main handlers ---

const NEXUS_INVOKE_MAIN_HANDLERS = {
  // rbs01095TheHighRiseTombs [LV1-2] Invoke Main: destroy own Purple → send 1 core from opposing Cost≤3
  rbs01095TheHighRiseTombs: {
    canInvoke(_nexus, player) {
      return player.spirits.some((s) => CARD_POOL[s.cardId]?.color === "purple");
    },
    invoke(game, nexus, player, targetUid = null) {
      if (!targetUid) {
        const purples = player.spirits.filter((s) => CARD_POOL[s.cardId]?.color === "purple");
        if (!purples.length) return;
        if (player.isAi) {
          targetUid = purples[0].uid;
        } else {
          game.awaitingEffect = {
            type: "tombsPickPurple",
            label: `${nexus.name}: Choose own Purple Spirit to destroy`,
            ownerId: player.id,
            validTargets: purples.map((s) => s.uid),
            optional: false,
            pendingBattleAttackerUid: null,
          };
          return;
        }
      }
      game._destroyOwnSpirit(player, targetUid);
      const opp = game._opp(player);
      const cost3 = opp.spirits.filter((s) => (CARD_POOL[s.cardId]?.cost ?? 0) <= 3);
      if (!cost3.length) { game.addLog(`${nexus.name}: no Cost≤3 opposing Spirit.`); return; }
      if (player.isAi) {
        game._sendCores(opp, cost3[0].uid, 1);
        game.addLog(`${nexus.name}: sent 1 core from ${cost3[0].name}.`);
      } else {
        game.awaitingEffect = {
          type: "sendCoreFromSpirit",
          label: `${nexus.name}: Send 1 core from opposing Cost≤3 Spirit`,
          ownerId: player.id,
          validTargets: cost3.map((s) => s.uid),
          optional: false,
          pendingBattleAttackerUid: null,
        };
      }
    },
  },
};

// --- Block Invoke Flash handlers ---

const BLOCK_INVOKE_FLASH_HANDLERS = {
  rsd06004Rhiceros: {
    canBlockInvoke(spirit, player) {
      return !spirit.blockInvokeUsed && player.nexuses.some((n) => isFerobeast(n.cardId) && !n.exhausted);
    },
    blockInvoke(game, spirit, player) {
      const nx = player.nexuses.find((n) => isFerobeast(n.cardId) && !n.exhausted);
      if (!nx) return;
      nx.exhausted = true;
      spirit.bpBoost = (spirit.bpBoost ?? 0) + 3000;
      spirit.blockInvokeUsed = true;
      game.addLog(`${spirit.name}: Block Invoke – exhausted ${nx.name}, +3000 BP.`);
    },
  },
  rsd06007Armalido: {
    canBlockInvoke(spirit, player, level) {
      return level >= 2 && !spirit.blockInvokeUsed && player.nexuses.some((n) => isFerobeast(n.cardId) && !n.exhausted);
    },
    blockInvoke(game, spirit, player) {
      const nx = player.nexuses.find((n) => isFerobeast(n.cardId) && !n.exhausted);
      if (!nx) return;
      nx.exhausted = true;
      spirit.bpBoost = (spirit.bpBoost ?? 0) + 3000;
      spirit.blockInvokeUsed = true;
      game.addLog(`${spirit.name}: Block Invoke – exhausted ${nx.name}, +3000 BP.`);
    },
  },
};

// Export invoke handlers for UI access
export { INVOKE_MAIN_HANDLERS, BLOCK_INVOKE_FLASH_HANDLERS };

// --- Object factories ---

function makeNexusFromCard(cardId, ownerId, turnNumber) {
  const card = CARD_POOL[cardId];
  const lv1Cores = card?.levels?.[0]?.cores ?? 0;
  return {
    uid: `${cardId}-${Math.random().toString(36).slice(2, 8)}`,
    cardId,
    ownerId,
    name: card.name,
    color: card.color,
    symbols: card.symbols,
    exhausted: false,
    cores: { normal: lv1Cores, soul: false },
    deployedTurn: turnNumber,
  };
}

function makeSpiritFromCard(cardId, ownerId, turnNumber, initialCores = 1) {
  const card = CARD_POOL[cardId];
  return {
    uid: `${cardId}-${Math.random().toString(36).slice(2, 8)}`,
    cardId,
    ownerId,
    name: card.name,
    color: card.color,
    symbols: card.symbols,
    bp: card.bp,
    bpBoost: 0,
    exhausted: false,
    cores: { normal: initialCores, soul: false },
    summonedTurn: turnNumber,
  };
}

function makePlayer(id, deckId, isAi) {
  const deckList = DECKS[deckId]?.cards ?? [];
  return {
    id,
    name: isAi ? "AI" : "You",
    isAi,
    deckId,
    deck: shuffle(deckList),
    hand: [],
    spirits: [],
    nexuses: [],
    trash: [],
    banished: [],
    reserve: { normal: 3, soul: true },
    trashCore: { normal: 0, soul: false },
    life: 5,
  };
}

function countSymbols(player, color) {
  const s = player.spirits.reduce((n, sp) => (sp.color === color ? n + sp.symbols : n), 0);
  const nx = player.nexuses.reduce((n, nx) => (nx.color === color ? n + nx.symbols : n), 0);
  return s + nx;
}

// Returns extra symbols granted by passive on-field effects when summoning `card`.
function passiveSymbolBonus(player, card) {
  // Forclawer LV2: gains +1 White symbol when owner summons a Cost ≥6 Mineroid spirit.
  if (card.type === "spirit" && card.cost >= 6 && isMineroid(card.id)) {
    const f = player.spirits.find((s) => s.cardId === "rsd04004TheHeavyClawForclawer");
    if (f && getCardLevel(f, CARD_POOL[f.cardId]) >= 2) return 1;
  }
  // Bloodrouse Mountain Range LV2 True Release: +1 Purple symbol when summoning Bloodrouse if opposing depleted this turn.
  if (card.type === "spirit" && isBloodrouse(card.id) && player._depletedOpponentThisTurn) {
    const nx = player.nexuses.find((n) => n.cardId === "rsd02009UtmostDepthBloodrouseMountainRange");
    if (nx && getCardLevel(nx, CARD_POOL[nx.cardId]) >= 2) return 1;
  }
  return 0;
}

function totalReserve(player) {
  return player.reserve.normal + (player.reserve.soul ? 1 : 0);
}

// All cores on field (reserve + all spirit cores + all nexus cores), excluding trash.
// Per rules, any of these can be used to pay costs or placed on a summoned spirit.
function totalFieldCores(player) {
  let total = player.reserve.normal + (player.reserve.soul ? 1 : 0);
  for (const s of player.spirits) {
    total += s.cores.normal + (s.cores.soul ? 1 : 0);
  }
  for (const n of player.nexuses) {
    total += n.cores.normal + (n.cores.soul ? 1 : 0);
  }
  return total;
}

// spec = { reserve:{normal,soul}, spirits:{uid:{normal,soul}}, nexuses:{uid:{normal,soul}} }
function _specTotal(spec) {
  let t = (spec.reserve?.normal ?? 0) + (spec.reserve?.soul ? 1 : 0);
  for (const v of Object.values(spec.spirits ?? {})) t += (v.normal ?? 0) + (v.soul ? 1 : 0);
  for (const v of Object.values(spec.nexuses ?? {})) t += (v.normal ?? 0) + (v.soul ? 1 : 0);
  return t;
}

function _applyPaySpec(player, spec) {
  const rN = spec.reserve?.normal ?? 0;
  player.reserve.normal -= rN; player.trashCore.normal += rN;
  if (spec.reserve?.soul) { player.reserve.soul = false; player.trashCore.soul = true; }
  for (const [uid, c] of Object.entries(spec.spirits ?? {})) {
    const s = player.spirits.find(sp => sp.uid === uid);
    if (!s) continue;
    s.cores.normal -= (c.normal ?? 0); player.trashCore.normal += (c.normal ?? 0);
    if (c.soul) { s.cores.soul = false; player.trashCore.soul = true; }
  }
  for (const [uid, c] of Object.entries(spec.nexuses ?? {})) {
    const n = player.nexuses.find(nx => nx.uid === uid);
    if (!n) continue;
    n.cores.normal -= (c.normal ?? 0); player.trashCore.normal += (c.normal ?? 0);
    if (c.soul) { n.cores.soul = false; player.trashCore.soul = true; }
  }
}

function _applyPlaceSpec(player, spirit, spec) {
  const rN = spec.reserve?.normal ?? 0;
  player.reserve.normal -= rN; spirit.cores.normal += rN;
  if (spec.reserve?.soul) { player.reserve.soul = false; spirit.cores.soul = true; }
  for (const [uid, c] of Object.entries(spec.spirits ?? {})) {
    const s = player.spirits.find(sp => sp.uid === uid && sp.uid !== spirit.uid);
    if (!s) continue;
    s.cores.normal -= (c.normal ?? 0); spirit.cores.normal += (c.normal ?? 0);
    if (c.soul && !spirit.cores.soul) { s.cores.soul = false; spirit.cores.soul = true; }
  }
  for (const [uid, c] of Object.entries(spec.nexuses ?? {})) {
    const n = player.nexuses.find(nx => nx.uid === uid);
    if (!n) continue;
    n.cores.normal -= (c.normal ?? 0); spirit.cores.normal += (c.normal ?? 0);
    if (c.soul && !spirit.cores.soul) { n.cores.soul = false; spirit.cores.soul = true; }
  }
}

function draw(player, amount) {
  for (let i = 0; i < amount; i += 1) {
    const id = player.deck.shift();
    if (!id) break;
    player.hand.push(id);
  }
}

// --- Game class ---

export class BattleSpiritGame {
  constructor({ playerDeckId, aiDeckId }) {
    this.players = [makePlayer(0, playerDeckId, false), makePlayer(1, aiDeckId, true)];
    this.currentPlayer = 0;
    this.turnNumber = 0;
    this.phaseIndex = 0;
    this.log = [];
    this.winner = null;
    this.awaitingBlock = null;
    this.awaitingEffect = null;
    this.awaitingFlash = null;
    this._lifeReducedThisTurn = false;

    draw(this.players[0], 4);
    draw(this.players[1], 4);
    this.startTurn();
  }

  getState() {
    return {
      players: this.players,
      currentPlayer: this.currentPlayer,
      turnNumber: this.turnNumber,
      phase: PHASE_ORDER[this.phaseIndex],
      winner: this.winner,
      awaitingBlock: this.awaitingBlock,
      awaitingEffect: this.awaitingEffect,
      awaitingFlash: this.awaitingFlash,
      log: this.log.slice(-8),
    };
  }

  _opp(player) { return this.players[player.id === 0 ? 1 : 0]; }
  activePlayer() { return this.players[this.currentPlayer]; }
  defendingPlayer() { return this.players[this.currentPlayer === 0 ? 1 : 0]; }
  addLog(msg) { this.log.push(msg); }

  // Helper: set awaitingEffect for human, auto-resolve for AI (destroySpirit only)
  _effectOrAuto(player, targets, sourceUid, pendingBattleUid, label, optional) {
    if (player.isAi) {
      const best = [...targets].sort(
        (a, b) => getEffectiveBP(b, CARD_POOL[b.cardId]) - getEffectiveBP(a, CARD_POOL[a.cardId]),
      )[0];
      this.destroySpirit(this._opp(player), best.uid);
    } else {
      this.awaitingEffect = {
        type: "destroySpirit",
        label,
        sourceUid,
        ownerId: player.id,
        validTargets: targets.map((t) => t.uid),
        optional,
        pendingBattleAttackerUid: pendingBattleUid,
      };
    }
  }

  checkDeckOutAtStart(player) {
    if (player.deck.length === 0) {
      this.winner = this._opp(player).id;
      this.addLog(`${player.name} decked out.`);
      return true;
    }
    return false;
  }

  refreshPlayer(player) {
    player.spirits.forEach((s) => {
      s.exhausted = false;
      s.bpBoost = 0;
      delete s._drawOnBattleEnd;
      delete s._mustAttackFirst;
      delete s._clashActive;
      delete s._cantAttackThisTurn;
      delete s._rumbleN;
      delete s._rumbleBonus;
      delete s._oncePerTurnUsed;
      delete s._blockRefreshUsed;
      delete s._drawOnLifeReduce;
      delete s._cantBlockThisTurn;
      delete s._destroyAfterBattle;
    });
    delete player._usedTopazMagicThisTurn;
    delete player._usedThunderDragonMagicThisTurn;
    player.nexuses.forEach((n) => {
      n.exhausted = false;
      delete n._grooveBoostUsed;
      delete n._oncePerTurnUsed;
    });
    player.reserve.normal += player.trashCore.normal;
    player.trashCore.normal = 0;
    if (player.trashCore.soul) { player.reserve.soul = true; player.trashCore.soul = false; }
  }

  startTurn() {
    if (this.winner !== null) return;
    this.phaseIndex = 0;
    this._lifeReducedThisTurn = false;
    const player = this.activePlayer();
    const skipFirst = this.turnNumber === 0 && this.currentPlayer === 0;
    player._depletedOpponentThisTurn = false;
    this.addLog(`Turn start: ${player.name}`);
    if (this.checkDeckOutAtStart(player)) return;
    if (!skipFirst) {
      player.reserve.normal += 1;
      this.addLog(`${player.name} gains 1 core.`);
    }
    draw(player, 1);
    this.addLog(`${player.name} draws 1 card.`);
    // Draw step nexus hooks (e.g. TheDowndraftDragonCurrent)
    player.nexuses.forEach((n) => {
      const level = getCardLevel(n, CARD_POOL[n.cardId]);
      CARD_EFFECTS[n.cardId]?.onDrawStep?.(this, n, player, level);
    });
    this.refreshPlayer(player);
  }

  // --- Core movement ---

  canMoveCore(fromType, fromUid, toType, toUid, isSoul = false) {
    const phase = PHASE_ORDER[this.phaseIndex];
    if (phase !== PHASES.MAIN && phase !== PHASES.MAIN2)
      return { ok: false, reason: "Core movement only in Main/Main2." };
    if (this.awaitingEffect || this.awaitingBlock)
      return { ok: false, reason: "Resolve pending response first." };

    const player = this.activePlayer();

    if (fromType === "reserve") {
      if (isSoul && !player.reserve.soul) return { ok: false, reason: "No Soul Core in reserve." };
      if (!isSoul && player.reserve.normal <= 0) return { ok: false, reason: "No cores in reserve." };
    } else if (fromType === "spirit") {
      const s = player.spirits.find((sp) => sp.uid === fromUid);
      if (!s) return { ok: false, reason: "Spirit not found." };
      if (isSoul && !s.cores.soul) return { ok: false, reason: "No Soul Core on spirit." };
      if (!isSoul && s.cores.normal <= 0) return { ok: false, reason: "No cores on spirit." };
    } else if (fromType === "nexus") {
      const n = player.nexuses.find((nx) => nx.uid === fromUid);
      if (!n) return { ok: false, reason: "Nexus not found." };
      if (isSoul && !n.cores.soul) return { ok: false, reason: "No Soul Core on nexus." };
      if (!isSoul && n.cores.normal <= 0) return { ok: false, reason: "No cores on nexus." };
    } else return { ok: false, reason: "Invalid source." };

    if (!["reserve", "spirit", "nexus"].includes(toType))
      return { ok: false, reason: "Invalid destination." };
    if (toType === "spirit") {
      const s = player.spirits.find((sp) => sp.uid === toUid);
      if (!s) return { ok: false, reason: "Destination spirit not found." };
      if (isSoul && s.cores.soul) return { ok: false, reason: "Spirit already has Soul Core." };
    }
    if (toType === "nexus") {
      const n = player.nexuses.find((nx) => nx.uid === toUid);
      if (!n) return { ok: false, reason: "Destination nexus not found." };
      if (isSoul && n.cores.soul) return { ok: false, reason: "Nexus already has Soul Core." };
    }
    return { ok: true };
  }

  moveCore(fromType, fromUid, toType, toUid, isSoul = false) {
    const verdict = this.canMoveCore(fromType, fromUid, toType, toUid, isSoul);
    if (!verdict.ok) return verdict;
    const player = this.activePlayer();

    // Remove from source
    if (fromType === "reserve") {
      if (isSoul) player.reserve.soul = false; else player.reserve.normal -= 1;
    } else if (fromType === "spirit") {
      const s = player.spirits.find((sp) => sp.uid === fromUid);
      if (isSoul) { s.cores.soul = false; } else {
        s.cores.normal -= 1;
        if (s.cores.normal === 0 && !s.cores.soul) { this.destroySpirit(player, fromUid); }
      }
    } else if (fromType === "nexus") {
      const n = player.nexuses.find((nx) => nx.uid === fromUid);
      if (isSoul) n.cores.soul = false; else n.cores.normal -= 1;
    }

    // Add to destination
    if (toType === "reserve") {
      if (isSoul) player.reserve.soul = true; else player.reserve.normal += 1;
    } else if (toType === "spirit") {
      const s = player.spirits.find((sp) => sp.uid === toUid);
      if (s) { if (isSoul) s.cores.soul = true; else s.cores.normal += 1; }
    } else if (toType === "nexus") {
      const n = player.nexuses.find((nx) => nx.uid === toUid);
      if (n) { if (isSoul) n.cores.soul = true; else n.cores.normal += 1; }
    }
    return { ok: true };
  }

  // --- Summon ---

  canSummon(handIndex) {
    const player = this.activePlayer();
    const phase = PHASE_ORDER[this.phaseIndex];
    if (phase !== PHASES.MAIN && phase !== PHASES.MAIN2)
      return { ok: false, reason: "Summon only in Main/Main2." };
    if (this.awaitingEffect) return { ok: false, reason: "Resolve pending effect first." };
    const cardId = player.hand[handIndex];
    const card = CARD_POOL[cardId];
    if (!card || card.type !== "spirit") return { ok: false, reason: "Not a spirit card." };
    const reduction = Math.min(card.reduction, countSymbols(player, card.color) + passiveSymbolBonus(player, card));
    const actualCost = Math.max(0, card.cost - reduction);
    const lv1Min = card.levels?.[0]?.cores ?? 1;
    const legacyAvailable = hasKeyword(cardId, "Legacy")
      ? player.trash.filter(id => CARD_POOL[id]?.exsymbols).length
      : 0;
    // Minimum field cores needed (assuming max legacy used)
    const minFieldNeeded = Math.max(0, actualCost - legacyAvailable) + lv1Min;
    if (totalFieldCores(player) < minFieldNeeded) return { ok: false, reason: "Not enough cores." };
    const maxPlaceable = totalFieldCores(player) - actualCost;
    return { ok: true, actualCost, card, lv1Min, maxPlaceable, legacyAvailable };
  }

  payFromReserve(player, amount, useSoulFirst = false) {
    let remain = amount;
    if (useSoulFirst && player.reserve.soul && remain > 0) {
      player.reserve.soul = false; player.trashCore.soul = true; remain -= 1;
    }
    while (remain > 0 && player.reserve.normal > 0) {
      player.reserve.normal -= 1; player.trashCore.normal += 1; remain -= 1;
    }
    if (!useSoulFirst && remain > 0 && player.reserve.soul) {
      player.reserve.soul = false; player.trashCore.soul = true; remain -= 1;
    }
    return remain === 0;
  }

  // Move cores from spirits/nexuses to reserve to cover needed total reserve.
  // Per rules, any field cores (including LV1 minimum) can be used for cost payment.
  autoMoveCoresToReserve(player, needed) {
    let remaining = needed - totalReserve(player);
    if (remaining <= 0) return;
    for (const s of [...player.spirits].sort((a, b) => b.cores.normal - a.cores.normal)) {
      if (remaining <= 0) break;
      const take = Math.min(s.cores.normal, remaining);
      if (take > 0) { s.cores.normal -= take; player.reserve.normal += take; remaining -= take; }
      if (remaining > 0 && s.cores.soul && !player.reserve.soul) {
        s.cores.soul = false; player.reserve.soul = true; remaining -= 1;
      }
    }
    for (const n of [...player.nexuses].sort((a, b) => b.cores.normal - a.cores.normal)) {
      if (remaining <= 0) break;
      const take = Math.min(n.cores.normal, remaining);
      if (take > 0) { n.cores.normal -= take; player.reserve.normal += take; remaining -= take; }
      if (remaining > 0 && n.cores.soul && !player.reserve.soul) {
        n.cores.soul = false; player.reserve.soul = true; remaining -= 1;
      }
    }
  }

  // Move `count` cores from field (reserve → spirits → nexuses) onto `spirit`.
  // Soul core from reserve goes to spirit.cores.soul; from spirits/nexuses goes to spirit.cores.normal (simplified).
  placeCoresOnSpirit(player, spirit, count) {
    let remaining = count;
    const fromNormal = Math.min(player.reserve.normal, remaining);
    if (fromNormal > 0) { player.reserve.normal -= fromNormal; spirit.cores.normal += fromNormal; remaining -= fromNormal; }
    if (remaining > 0 && player.reserve.soul) {
      player.reserve.soul = false; spirit.cores.soul = true; remaining -= 1;
    }
    for (const s of [...player.spirits].filter(s => s.uid !== spirit.uid).sort((a, b) => b.cores.normal - a.cores.normal)) {
      if (remaining <= 0) break;
      const take = Math.min(s.cores.normal, remaining);
      if (take > 0) { s.cores.normal -= take; spirit.cores.normal += take; remaining -= take; }
      if (remaining > 0 && s.cores.soul && !spirit.cores.soul) {
        s.cores.soul = false; spirit.cores.normal += 1; remaining -= 1;
      }
    }
    for (const n of [...player.nexuses].sort((a, b) => b.cores.normal - a.cores.normal)) {
      if (remaining <= 0) break;
      const take = Math.min(n.cores.normal, remaining);
      if (take > 0) { n.cores.normal -= take; spirit.cores.normal += take; remaining -= take; }
      if (remaining > 0 && n.cores.soul && !spirit.cores.soul) {
        n.cores.soul = false; spirit.cores.normal += 1; remaining -= 1;
      }
    }
  }

  summon(handIndex, { useSoulCore = false, coresToPlace } = {}) {
    const player = this.activePlayer();
    const verdict = this.canSummon(handIndex);
    if (!verdict.ok) return verdict;
    const { actualCost, card, lv1Min } = verdict;
    const placement = coresToPlace ?? lv1Min;
    // Move enough for payment to reserve
    this.autoMoveCoresToReserve(player, actualCost);
    this._checkAndDestroyDepleted(player);
    // If normals not enough for payment alone, use soul for payment first
    const needSoulForPayment = player.reserve.normal < actualCost && player.reserve.soul;
    if (!this.payFromReserve(player, actualCost, useSoulCore || needSoulForPayment))
      return { ok: false, reason: "Payment failed." };
    const [cardId] = player.hand.splice(handIndex, 1);
    const spirit = makeSpiritFromCard(cardId, player.id, this.turnNumber, 0);
    player.spirits.push(spirit);
    this.placeCoresOnSpirit(player, spirit, placement);
    this._checkAndDestroyDepleted(player);
    this.addLog(`${player.name} summons ${card.name} (cost ${actualCost}).`);
    CARD_EFFECTS[cardId]?.onSummon?.(this, spirit, player);
    player.nexuses.forEach((n) => {
      CARD_EFFECTS[n.cardId]?.onNexusSummon?.(this, n, player, spirit);
    });
    return { ok: true };
  }

  // Human-interactive summon: player explicitly specifies which cores to pay and place.
  summonWithSpecs(handIndex, paySpec, placeSpec, legacyBanishCount = 0) {
    const player = this.activePlayer();
    const verdict = this.canSummon(handIndex);
    if (!verdict.ok) return verdict;
    const { actualCost, card, lv1Min, legacyAvailable } = verdict;
    if (legacyBanishCount > (legacyAvailable ?? 0))
      return { ok: false, reason: `Only ${legacyAvailable} EX Symbols in Trash.` };
    // Move EX Symbol cards from trash to banished zone
    if (legacyBanishCount > 0) {
      let banished = 0;
      for (let i = player.trash.length - 1; i >= 0 && banished < legacyBanishCount; i--) {
        if (CARD_POOL[player.trash[i]]?.exsymbols) {
          const [id] = player.trash.splice(i, 1);
          player.banished.push(id);
          banished++;
        }
      }
    }
    const finalCost = Math.max(0, actualCost - legacyBanishCount);
    if (_specTotal(paySpec) !== finalCost)
      return { ok: false, reason: `Pay exactly ${finalCost} cores.` };
    if (_specTotal(placeSpec) < lv1Min)
      return { ok: false, reason: `Place at least ${lv1Min} core(s) on spirit.` };
    _applyPaySpec(player, paySpec);
    this._checkAndDestroyDepleted(player);
    const [cardId] = player.hand.splice(handIndex, 1);
    const spirit = makeSpiritFromCard(cardId, player.id, this.turnNumber, 0);
    player.spirits.push(spirit);
    _applyPlaceSpec(player, spirit, placeSpec);
    this._checkAndDestroyDepleted(player);
    const legacyNote = legacyBanishCount > 0 ? `, Legacy −${legacyBanishCount}` : '';
    this.addLog(`${player.name} summons ${card.name} (cost ${finalCost}${legacyNote}).`);
    CARD_EFFECTS[cardId]?.onSummon?.(this, spirit, player);
    player.nexuses.forEach((n) => {
      CARD_EFFECTS[n.cardId]?.onNexusSummon?.(this, n, player, spirit);
    });
    return { ok: true };
  }

  // --- Deploy Nexus ---

  canDeploy(handIndex) {
    const player = this.activePlayer();
    const phase = PHASE_ORDER[this.phaseIndex];
    if (phase !== PHASES.MAIN && phase !== PHASES.MAIN2)
      return { ok: false, reason: "Deploy only in Main/Main2." };
    if (this.awaitingEffect) return { ok: false, reason: "Resolve pending effect first." };
    const cardId = player.hand[handIndex];
    const card = CARD_POOL[cardId];
    if (!card || card.type !== "nexus") return { ok: false, reason: "Not a nexus card." };
    const reduction = Math.min(card.reduction, countSymbols(player, card.color));
    const actualCost = Math.max(0, card.cost - reduction);
    if (totalFieldCores(player) < actualCost) return { ok: false, reason: "Not enough cores." };
    return { ok: true, actualCost, card };
  }

  deployNexus(handIndex, paySpec = null) {
    const player = this.activePlayer();
    const verdict = this.canDeploy(handIndex);
    if (!verdict.ok) return verdict;
    const { actualCost, card } = verdict;
    if (paySpec) {
      if (_specTotal(paySpec) !== actualCost) return { ok: false, reason: `Pay exactly ${actualCost} cores.` };
      _applyPaySpec(player, paySpec);
      this._checkAndDestroyDepleted(player);
    } else {
      this.autoMoveCoresToReserve(player, actualCost);
      this._checkAndDestroyDepleted(player);
      if (!this.payFromReserve(player, actualCost)) return { ok: false, reason: "Payment failed." };
    }
    const [cardId] = player.hand.splice(handIndex, 1);
    const nexus = makeNexusFromCard(cardId, player.id, this.turnNumber);
    player.nexuses.push(nexus);
    this.addLog(`${player.name} deploys ${card.name} (cost ${actualCost}).`);
    CARD_EFFECTS[cardId]?.onDeploy?.(this, nexus, player);
    return { ok: true };
  }

  // --- Play Magic ---

  canPlayMagic(handIndex) {
    const player = this.activePlayer();
    const phase = PHASE_ORDER[this.phaseIndex];
    if (phase !== PHASES.MAIN && phase !== PHASES.MAIN2)
      return { ok: false, reason: "Play magic only in Main/Main2." };
    if (this.awaitingEffect) return { ok: false, reason: "Resolve pending effect first." };
    const cardId = player.hand[handIndex];
    const card = CARD_POOL[cardId];
    if (!card || card.type !== "magic") return { ok: false, reason: "Not a magic card." };
    const reduction = Math.min(card.reduction, countSymbols(player, card.color));
    const actualCost = Math.max(0, card.cost - reduction);
    if (totalFieldCores(player) < actualCost) return { ok: false, reason: "Not enough cores." };
    return { ok: true, actualCost, card };
  }

  playMagic(handIndex, targetUid = null, useFlash = false, paySpec = null) {
    const player = this.activePlayer();
    const verdict = this.canPlayMagic(handIndex);
    if (!verdict.ok) return verdict;
    const { actualCost } = verdict;
    const cardId = player.hand[handIndex];
    const handler = useFlash ? MAGIC_FLASH_EFFECTS[cardId] : MAGIC_EFFECTS[cardId];
    const targets = useFlash
      ? (handler?.getFlashTargets?.(this, player) ?? [])
      : (handler?.getMainTargets?.(this, player) ?? []);

    if (targets.length > 0 && targetUid === null) {
      if (player.isAi) {
        targetUid = targets[0].uid;
      } else {
        this.awaitingEffect = {
          type: useFlash ? "selectMagicFlashTarget" : "selectMagicTarget",
          label: `${CARD_POOL[cardId]?.name}: Select target`,
          handIndex,
          paySpec,
          ownerId: player.id,
          validTargets: targets.map((t) => t.uid),
          optional: false,
          pendingBattleAttackerUid: null,
        };
        return { ok: true, awaitingTarget: true };
      }
    }

    if (paySpec) {
      if (_specTotal(paySpec) !== actualCost) return { ok: false, reason: `Pay exactly ${actualCost} cores.` };
      _applyPaySpec(player, paySpec);
      this._checkAndDestroyDepleted(player);
    } else {
      this.autoMoveCoresToReserve(player, actualCost);
      this._checkAndDestroyDepleted(player);
      if (!this.payFromReserve(player, actualCost)) return { ok: false, reason: "Payment failed." };
    }
    player.hand.splice(handIndex, 1);
    player.trash.push(cardId);
    this.addLog(`${player.name} plays ${CARD_POOL[cardId]?.name} (cost ${actualCost}).`);
    if (useFlash) {
      handler?.flash?.(this, player, targetUid);
    } else {
      handler?.main?.(this, player, targetUid);
    }
    if (isTopaz(cardId)) player._usedTopazMagicThisTurn = true;
    // Trigger onMagicPlay hooks for all player spirits
    player.spirits.forEach((s) => {
      const sl = getCardLevel(s, CARD_POOL[s.cardId]);
      CARD_EFFECTS[s.cardId]?.onMagicPlay?.(this, s, player, sl, cardId);
    });
    // Trigger onNexusMagicPlay hooks for all player nexuses
    player.nexuses.forEach((n) => {
      const nl = getCardLevel(n, CARD_POOL[n.cardId]);
      CARD_EFFECTS[n.cardId]?.onNexusMagicPlay?.(this, n, player, nl, cardId);
    });
    return { ok: true };
  }

  // --- Effect resolution ---

  resolveEffect(targetUid, aiBlockChooser = null) {
    if (!this.awaitingEffect) return { ok: false, reason: "No pending effect." };
    const eff = this.awaitingEffect;
    this.awaitingEffect = null;
    const player = this.players[eff.ownerId];

    const opp = this._opp(player);
    if (eff.type === "destroySpirit") {
      if (!targetUid && !eff.optional) return { ok: false, reason: "Must select a target." };
      if (targetUid) this.destroySpirit(opp, targetUid);
    } else if (eff.type === "returnCardFromTrash") {
      if (targetUid && player.trash.includes(targetUid)) {
        player.trash.splice(player.trash.lastIndexOf(targetUid), 1);
        player.hand.push(targetUid);
        this.addLog(`Returned ${CARD_POOL[targetUid]?.name} to hand.`);
      }
    } else if (eff.type === "sendSoulFromTrash") {
      if (!targetUid && !eff.optional) return { ok: false, reason: "Must select a target." };
      if (targetUid) {
        const all = [...player.spirits, ...(player.nexuses ?? [])];
        const target = all.find((x) => x.uid === targetUid);
        if (target) {
          player.trashCore.soul = false;
          target.cores.soul = true;
          this.addLog(`${eff.sourceName ?? 'Effect'}: Soul Core Trash → ${target.name}.`);
        }
      }
    } else if (eff.type === "deckReveal") {
      player.hand.push(...eff.toHand);
      player.deck.push(...(eff.toBottom ?? []));
      if (eff.toTrash?.length) player.trash.push(...eff.toTrash);
      const added = eff.toHand.map(id => CARD_POOL[id]?.name ?? id).join(", ");
      const trashNote = eff.toTrash?.length ? `, ${eff.toTrash.length} to Trash` : '';
      this.addLog(`${eff.sourceName}: added ${added || "nothing"} to Hand, returned ${(eff.toBottom ?? []).length} to deck${trashNote}.`);
    } else if (eff.type === "selectMagicTarget") {
      return this.playMagic(eff.handIndex, targetUid, false, eff.paySpec ?? null);
    } else if (eff.type === "selectMagicFlashTarget") {
      return this.playMagic(eff.handIndex, targetUid, true, eff.paySpec ?? null);
    } else if (eff.type === "selectFlashTarget") {
      return this.playFlashMagic(eff.handIndex, targetUid, eff.paySpec ?? null);
    } else if (eff.type === "sendCoreFromSpirit") {
      if (!targetUid && !eff.optional) return { ok: false, reason: "Must select a target." };
      if (targetUid) { this._sendCores(opp, targetUid, 1); this.addLog(`Sent 1 core from ${opp.spirits.find(s=>s.uid===targetUid)?.name ?? "spirit"}.`); }
    } else if (eff.type === "sendCoreAndDrawIfDepleted") {
      if (!targetUid && !eff.optional) return { ok: false, reason: "Must select a target." };
      if (targetUid) {
        const depleted = this._sendCores(opp, targetUid, 1);
        if (depleted) { draw(player, 1); this.addLog(`Drew 1 card (spirit depleted).`); }
      }
    } else if (eff.type === "drainToOne") {
      if (!targetUid && !eff.optional) return { ok: false, reason: "Must select a target." };
      if (targetUid) this._drainToOne(opp, targetUid);
    } else if (eff.type === "exhaustSpirit") {
      if (targetUid) { const t = opp.spirits.find(s => s.uid === targetUid); if (t) { t.exhausted = true; this.addLog(`${t.name} exhausted.`); } }
    } else if (eff.type === "returnToHand") {
      if (!targetUid && !eff.optional) return { ok: false, reason: "Must select a target." };
      if (targetUid) this._returnToHand(opp, targetUid);
    } else if (eff.type === "returnToDeckBottom") {
      if (!targetUid && !eff.optional) return { ok: false, reason: "Must select a target." };
      if (targetUid) this._returnToDeckBottom(opp, targetUid);
    } else if (eff.type === "bpDamage2000") {
      if (!targetUid && !eff.optional) return { ok: false, reason: "Must select a target." };
      if (targetUid) this._bpDamage(opp, targetUid, 2000);
    } else if (eff.type === "bpDamage4000") {
      if (!targetUid && !eff.optional) return { ok: false, reason: "Must select a target." };
      if (targetUid) this._bpDamage(opp, targetUid, 4000);
    } else if (eff.type === "summonFromReveal") {
      if (targetUid && player.hand.includes(targetUid)) {
        this.addLog(`Added ${CARD_POOL[targetUid]?.name} to hand.`);
      }
    } else if (eff.type === "forceAttack") {
      if (targetUid) {
        const opp = this._opp(player);
        const t = opp.spirits.find((s) => s.uid === targetUid);
        if (t) { t._mustAttackFirst = true; this.addLog(`${t.name} must attack first!`); }
      }
    } else if (eff.type === "exhaustToBlock") {
      if (targetUid) {
        const defPlayer = this.players[eff.ownerId];
        const exhauster = defPlayer.spirits.find((s) => s.uid === targetUid);
        if (exhauster) { exhauster.exhausted = true; this.addLog(`${exhauster.name} exhausted to pay block cost.`); }
      }
      return this.resolveBattle(eff.pendingAttackerUid, eff.pendingBlockerUid);
    } else if (eff.type === "destroyNexus") {
      if (!targetUid && !eff.optional) return { ok: false, reason: "Must select a target." };
      if (targetUid) this._destroyNexus(opp, targetUid);
    } else if (eff.type === "coreFromVoidToOwnSpirit") {
      if (!targetUid && !eff.optional) return { ok: false, reason: "Must select a target." };
      if (targetUid) this._coreFromVoidToSpirit(player, targetUid);
    } else if (eff.type === "refreshOwnSpirit") {
      if (!targetUid && !eff.optional) return { ok: false, reason: "Must select a target." };
      if (targetUid) this._refreshSpirit(player, targetUid);
    } else if (eff.type === "destroyOwnSpirit") {
      if (!targetUid && !eff.optional) return { ok: false, reason: "Must select a target." };
      if (targetUid) this._destroyOwnSpirit(player, targetUid);
    } else if (eff.type === "summonFromTrash") {
      if (targetUid && player.trash.includes(targetUid)) {
        const card = CARD_POOL[targetUid];
        player.trash.splice(player.trash.indexOf(targetUid), 1);
        const spirit = makeSpiritFromCard(targetUid, player.id, this.turnNumber);
        player.spirits.push(spirit);
        this.addLog(`${card?.name ?? targetUid} summoned from Trash (Shamanism).`);
        CARD_EFFECTS[targetUid]?.onSummon?.(this, spirit, player);
      }
    } else if (eff.type === "exhaustOwnSpirit") {
      if (!targetUid && !eff.optional) return { ok: false, reason: "Must select a target." };
      if (targetUid) {
        const t = player.spirits.find((s) => s.uid === targetUid);
        if (t) { t.exhausted = true; this.addLog(`${t.name} exhausted.`); }
      }
    } else if (eff.type === "tombsPickPurple") {
      if (!targetUid && !eff.optional) return { ok: false, reason: "Must select a target." };
      if (targetUid) {
        this._destroyOwnSpirit(player, targetUid);
        const cost3 = opp.spirits.filter((s) => (CARD_POOL[s.cardId]?.cost ?? 0) <= 3);
        if (!cost3.length) { this.addLog(`High Rise Tombs: no Cost≤3 opposing Spirit.`); }
        else {
          this.awaitingEffect = {
            type: "sendCoreFromSpirit",
            label: "High Rise Tombs: Send 1 core from opposing Cost≤3 Spirit",
            ownerId: player.id,
            validTargets: cost3.map((s) => s.uid),
            optional: false,
            pendingBattleAttackerUid: null,
          };
          return { ok: true };
        }
      }
    } else if (eff.type === "defensiveGateSecond") {
      if (!targetUid && !eff.optional) return { ok: false, reason: "Must select a target." };
      if (targetUid) {
        const t = opp.spirits.find((s) => s.uid === targetUid);
        if (t) { t._cantReduceLife = true; this.addLog(`Defensive Gate: ${t.name} also can't reduce life this turn.`); }
      }
    } else if (eff.type === "coreFromTrashToOwnSpirit") {
      if (!targetUid && !eff.optional) return { ok: false, reason: "Must select a target." };
      if (targetUid && player.trashCore.normal > 0) {
        const t = player.spirits.find((s) => s.uid === targetUid);
        if (t) {
          player.trashCore.normal -= 1;
          t.cores.normal += 1;
          this.addLog(`Core from Trash → ${t.name}.`);
        }
      }
    } else if (eff.type === "bpBoostOwnClashSpirit2000") {
      if (!targetUid && !eff.optional) return { ok: false, reason: "Must select a target." };
      if (targetUid) {
        const t = player.spirits.find((s) => s.uid === targetUid);
        if (t) {
          t.bpBoost = (t.bpBoost ?? 0) + 2000;
          this.addLog(`${t.name} +2000 BP this turn.`);
        }
      }
    } else if (eff.type === "triggerSummonEffect") {
      if (!targetUid && !eff.optional) return { ok: false, reason: "Must select a target." };
      if (targetUid) {
        const t = player.spirits.find((s) => s.uid === targetUid);
        if (t) {
          CARD_EFFECTS[t.cardId]?.onSummon?.(this, t, player);
          this.addLog(`Steguman: re-triggered ${t.name}'s When Summoned.`);
        }
      }
    } else if (eff.type === "discardWindfangForBP") {
      if (!targetUid && !eff.optional) return { ok: false, reason: "Must select a card." };
      if (targetUid !== null && targetUid !== undefined) {
        const idx = parseInt(targetUid);
        if (!isNaN(idx) && idx >= 0 && idx < player.hand.length) {
          const cardId = player.hand.splice(idx, 1)[0];
          player.trash.push(cardId);
          const src = player.spirits.find((s) => s.uid === eff.sourceUid);
          if (src) src.bpBoost = (src.bpBoost ?? 0) + 3000;
          this.addLog(`${eff.sourceName}: discarded ${CARD_POOL[cardId]?.name ?? cardId}, +3000 BP.`);
        }
      }
    } else if (eff.type === "returnHandCardToDeckBottom") {
      if (!targetUid && !eff.optional) return { ok: false, reason: "Must select a card." };
      if (targetUid !== null && targetUid !== undefined) {
        const idx = parseInt(targetUid);
        if (!isNaN(idx) && idx >= 0 && idx < player.hand.length) {
          const cardId = player.hand.splice(idx, 1)[0];
          player.deck.push(cardId);
          this.addLog(`${CARD_POOL[cardId]?.name ?? cardId} returned to deckbottom.`);
        }
      }
    } else if (eff.type === "magirrateMagic") {
      // Player selects which Topaz magic to play for free
      if (!targetUid) return { ok: false, reason: "Must select a Topaz Magic card." };
      const idx = parseInt(targetUid);
      if (isNaN(idx) || idx < 0 || idx >= player.hand.length) return { ok: false };
      const cardId = player.hand[idx];
      const handler = MAGIC_FLASH_EFFECTS[cardId];
      const targets = handler?.getFlashTargets?.(this, player) ?? [];
      if (targets.length > 0) {
        this.awaitingEffect = {
          type: "magirrateMagicTarget",
          label: `${CARD_POOL[cardId]?.name} (Magirrate Flash): Select target`,
          ownerId: player.id,
          handIndex: idx,
          validTargets: targets.map((t) => t.uid),
          optional: false,
          pendingBattleAttackerUid: null,
        };
        return { ok: true };
      }
      // No target needed — execute immediately
      player.hand.splice(idx, 1);
      player.trash.push(cardId);
      this.addLog(`${player.name}: Magirrate – ${CARD_POOL[cardId]?.name} (Flash, free).`);
      handler?.flash?.(this, player, null);
      player._usedTopazMagicThisTurn = true;
      player.spirits.forEach((s) => {
        CARD_EFFECTS[s.cardId]?.onMagicPlay?.(this, s, player, getCardLevel(s, CARD_POOL[s.cardId]), cardId);
      });
      player.nexuses.forEach((n) => {
        CARD_EFFECTS[n.cardId]?.onNexusMagicPlay?.(this, n, player, getCardLevel(n, CARD_POOL[n.cardId]), cardId);
      });
      return { ok: true };
    } else if (eff.type === "magirrateMagicTarget") {
      // Player selects the flash target for the chosen Topaz magic
      if (!targetUid) return { ok: false, reason: "Must select a target." };
      const { handIndex } = eff;
      const cardId = player.hand[handIndex];
      if (!cardId) return { ok: false };
      const handler = MAGIC_FLASH_EFFECTS[cardId];
      player.hand.splice(handIndex, 1);
      player.trash.push(cardId);
      this.addLog(`${player.name}: Magirrate – ${CARD_POOL[cardId]?.name} (Flash, free).`);
      handler?.flash?.(this, player, targetUid);
      player._usedTopazMagicThisTurn = true;
      player.spirits.forEach((s) => {
        CARD_EFFECTS[s.cardId]?.onMagicPlay?.(this, s, player, getCardLevel(s, CARD_POOL[s.cardId]), cardId);
      });
      player.nexuses.forEach((n) => {
        CARD_EFFECTS[n.cardId]?.onNexusMagicPlay?.(this, n, player, getCardLevel(n, CARD_POOL[n.cardId]), cardId);
      });
      return { ok: true };
    }

    if (eff.pendingBattleAttackerUid) {
      this._pendingAiBlockChooser = aiBlockChooser;
      this.awaitingFlash = { attackerUid: eff.pendingBattleAttackerUid };
      if (!this._hasAnyFlashAction()) {
        this.awaitingFlash = null;
        return this._proceedToBattle(eff.pendingBattleAttackerUid, aiBlockChooser);
      }
      return { ok: true, awaitingFlash: true };
    }
    return { ok: true };
  }

  // --- Attack ---

  canAttack(attackerUid) {
    const phase = PHASE_ORDER[this.phaseIndex];
    if (phase !== PHASES.ATTACK) return { ok: false, reason: "Attack only in Attack Step." };
    if (this.awaitingEffect || this.awaitingBlock)
      return { ok: false, reason: "Resolve pending responses first." };
    const player = this.activePlayer();
    const attacker = player.spirits.find((s) => s.uid === attackerUid);
    if (!attacker) return { ok: false, reason: "Attacker not found." };
    if (attacker.exhausted)
      return { ok: false, reason: "Spirit already attacked." };
    if (attacker._cantAttackAtLV1 && getCardLevel(attacker, CARD_POOL[attacker.cardId]) === 1)
      return { ok: false, reason: "This Spirit can't attack at LV1." };
    if (attacker._cantAttackThisTurn)
      return { ok: false, reason: "This Spirit can't attack this turn." };
    return { ok: true, attacker };
  }

  // Destroy any spirits/nexuses whose total cores have fallen below their LV1 minimum.
  _checkAndDestroyDepleted(player) {
    const spiritsToDestroy = player.spirits
      .filter(s => {
        const lv1Min = CARD_POOL[s.cardId]?.levels?.[0]?.cores ?? 1;
        return s.cores.normal + (s.cores.soul ? 1 : 0) < lv1Min;
      })
      .map(s => s.uid);
    spiritsToDestroy.forEach(uid => this.destroySpirit(player, uid));
    const nexusesToDestroy = player.nexuses
      .filter(n => {
        const lv1Min = CARD_POOL[n.cardId]?.levels?.[0]?.cores ?? 0;
        return lv1Min > 0 && n.cores.normal + (n.cores.soul ? 1 : 0) < lv1Min;
      })
      .map(n => n.uid);
    nexusesToDestroy.forEach(uid => this._destroyNexus(player, uid));
  }

  destroySpirit(player, uid) {
    const idx = player.spirits.findIndex((s) => s.uid === uid);
    if (idx < 0) return;
    const spirit = player.spirits[idx];
    CARD_EFFECTS[spirit.cardId]?.onDestroy?.(this, spirit, player);
    player.reserve.normal += spirit.cores.normal;
    if (spirit.cores.soul) player.reserve.soul = true;
    player.trash.push(spirit.cardId);
    player.spirits.splice(idx, 1);
    this.addLog(`${spirit.name} is destroyed.`);
  }

  resolveBattle(attackerUid, blockerUid = null) {
    const atkPlayer = this.activePlayer();
    const defPlayer = this.defendingPlayer();
    const attacker = atkPlayer.spirits.find((s) => s.uid === attackerUid);
    if (!attacker) return { ok: false, reason: "Attacker missing." };

    const atkBP = getEffectiveBP(attacker, CARD_POOL[attacker.cardId]);

    if (!blockerUid) {
      if (attacker._cantReduceLife) {
        this.addLog(`${attacker.name}'s attack: life reduction prevented (Defensive Gate).`);
        delete attacker._cantReduceLife;
      } else {
        this._reduceLife(defPlayer, attacker.symbols);
        this._lifeReducedThisTurn = true;
        this.addLog(`${attacker.name} hits for ${attacker.symbols} life.`);
        if (defPlayer.life <= 0) this.winner = atkPlayer.id;
        // Rumble when no blocker: discard N cards (no cost reduction)
        if (attacker._rumbleN > 0) {
          const n = attacker._rumbleN + (attacker._rumbleBonus ?? 0);
          const discarded = defPlayer.deck.splice(0, n);
          defPlayer.trash.push(...discarded);
          this.addLog(`${attacker.name}: Rumble – discard ${n} (no blocker).`);
          delete attacker._rumbleN;
          delete attacker._rumbleBonus;
        }
        if (attacker._drawOnLifeReduce) {
          draw(atkPlayer, 2);
          if (atkPlayer.hand.length >= 1) atkPlayer.deck.push(...atkPlayer.hand.splice(0, 1));
          this.addLog(`${attacker.name}: drew 2, returned 1 to deckbottom.`);
          delete attacker._drawOnLifeReduce;
        }
        // Nexus triggers on life reduction (no blocker)
        atkPlayer.nexuses.forEach((n) => {
          const level = getCardLevel(n, CARD_POOL[n.cardId]);
          CARD_EFFECTS[n.cardId]?.onAtkLifeReduced?.(this, n, atkPlayer, attacker, level);
        });
        defPlayer.nexuses.forEach((n) => {
          const level = getCardLevel(n, CARD_POOL[n.cardId]);
          CARD_EFFECTS[n.cardId]?.onOwnLifeReduced?.(this, n, defPlayer, level);
        });
      }
    } else {
      const blocker = defPlayer.spirits.find((s) => s.uid === blockerUid);
      if (!blocker) {
        this._reduceLife(defPlayer, attacker.symbols);
        if (defPlayer.life <= 0) this.winner = atkPlayer.id;
      } else {
        const blkCard = CARD_POOL[blocker.cardId];
        const blkLevel = getCardLevel(blocker, blkCard);
        CARD_EFFECTS[blocker.cardId]?.onBlock?.(this, blocker, defPlayer, blkLevel);
        const blkBP = getEffectiveBP(blocker, blkCard);
        const blockerCost = blkCard?.cost ?? 0;
        const blockerCardId = blocker.cardId;
        // Store blocker BP on attacker for onAttackWin checks
        attacker._prevBlockerBP = blkBP;
        blocker.exhausted = true;
        // rbs01091 LV2 True Release: blocking spirit vs Clash can't lose cores below 1
        if (hasClash(attacker.cardId)) {
          const tlvcNexus = atkPlayer.nexuses.find((n) => n.cardId === "rbs01091TheLayeredVermilionClouds");
          if (tlvcNexus && getCardLevel(tlvcNexus, CARD_POOL[tlvcNexus.cardId]) >= 2) {
            blocker._coreFloorOne = true;
          }
        }
        this.addLog(`${blocker.name} (${blkBP}) blocks ${attacker.name} (${atkBP}).`);
        if (atkBP > blkBP) this.destroySpirit(defPlayer, blocker.uid);
        else if (atkBP < blkBP) {
          this.destroySpirit(atkPlayer, attacker.uid);
          // rbs01096 HuntingTree: own Bloodrouse destroyed by BP comparison
          const htNexus = atkPlayer.nexuses.find((n) => n.cardId === "rbs01096HuntingTree");
          if (htNexus && isBloodrouse(attacker.cardId)) {
            const htLevel = getCardLevel(htNexus, CARD_POOL[htNexus.cardId]);
            if (htLevel >= 2) {
              draw(atkPlayer, 1);
              this.addLog(`${htNexus.name}: Bloodrouse destroyed – drew 1 card (LV2).`);
            }
            const blockerAlive = defPlayer.spirits.find((s) => s.uid === blocker.uid);
            if (blockerAlive) {
              if (atkPlayer.isAi) {
                this._sendCores(defPlayer, blocker.uid, 1);
                this.addLog(`${htNexus.name}: sent 1 core from ${blocker.name}.`);
              } else {
                this.awaitingEffect = {
                  type: "sendCoreFromSpirit",
                  label: `${htNexus.name}: Send 1 core from blocking Spirit`,
                  ownerId: atkPlayer.id,
                  validTargets: [blocker.uid],
                  optional: true,
                  pendingBattleAttackerUid: null,
                };
              }
            }
          }
        }
        else {
          this.destroySpirit(defPlayer, blocker.uid);
          this.destroySpirit(atkPlayer, attacker.uid);
          // rbs01096 HuntingTree LV2: Bloodrouse destroyed (equal BP) — draw only, no blocker target
          const htNexus2 = atkPlayer.nexuses.find((n) => n.cardId === "rbs01096HuntingTree");
          if (htNexus2 && isBloodrouse(attacker.cardId) && getCardLevel(htNexus2, CARD_POOL[htNexus2.cardId]) >= 2) {
            draw(atkPlayer, 1);
            this.addLog(`${htNexus2.name}: Bloodrouse destroyed – drew 1 card (LV2).`);
          }
        }
        // Rumble: discard from opposing deck at end of battle
        const stillAliveForRumble = atkPlayer.spirits.find((s) => s.uid === attackerUid);
        if (stillAliveForRumble?._rumbleN > 0) {
          const blockerDestroyed = !defPlayer.spirits.find((s) => s.uid === blockerUid);
          let n = stillAliveForRumble._rumbleN + (stillAliveForRumble._rumbleBonus ?? 0);
          if (blockerDestroyed) n = Math.max(0, n - blockerCost);
          if (n > 0) {
            const discarded = defPlayer.deck.splice(0, n);
            defPlayer.trash.push(...discarded);
            this.addLog(`${stillAliveForRumble.name}: Rumble – discard ${n} (card${n !== 1 ? "s" : ""}).`);
          }
          delete stillAliveForRumble._rumbleN;
          delete stillAliveForRumble._rumbleBonus;
        }
        void blockerCardId; // used above for rumble cost calc via blockerCost
      }
    }

    // Post-battle
    const stillAlive = atkPlayer.spirits.find((s) => s.uid === attackerUid);
    const stillAliveBlocker = blockerUid ? defPlayer.spirits.find((s) => s.uid === blockerUid) : null;

    // onAttackWin: attacker survived, blocker was destroyed by BP comparison
    if (blockerUid && stillAlive && !stillAliveBlocker) {
      const atkLevel2 = getCardLevel(stillAlive, CARD_POOL[stillAlive.cardId]);
      CARD_EFFECTS[stillAlive.cardId]?.onAttackWin?.(this, stillAlive, atkPlayer, atkLevel2);
    }
    // onBlockWin: blocker survived, attacker was destroyed by BP comparison
    if (blockerUid && stillAliveBlocker && !stillAlive) {
      const blkCard2 = CARD_POOL[stillAliveBlocker.cardId];
      const blkLevel2 = getCardLevel(stillAliveBlocker, blkCard2);
      CARD_EFFECTS[stillAliveBlocker.cardId]?.onBlockWin?.(this, stillAliveBlocker, defPlayer, blkLevel2);
    }

    // Extra life reduction on attack win (VermillionRoar)
    if (stillAlive?._extraLifeReductionOnWin && blockerUid && !stillAliveBlocker) {
      this._reduceLife(defPlayer, 1);
      this.addLog(`${stillAlive.name}: extra life reduction (blocker destroyed).`);
      if (defPlayer.life <= 0) this.winner = atkPlayer.id;
    }
    // Draw 2 on attack win (HydroForce)
    if (stillAlive?._drawTwoOnAttackWin && blockerUid && !stillAliveBlocker) {
      draw(atkPlayer, 2);
      this.addLog(`${stillAlive.name}: drew 2 cards (blocker destroyed).`);
    }

    // Destroy spirits summoned for this battle only (Awakening)
    [...atkPlayer.spirits, ...defPlayer.spirits].forEach((s) => {
      if (s._destroyAfterBattle) {
        const owner = atkPlayer.spirits.includes(s) ? atkPlayer : defPlayer;
        this.destroySpirit(owner, s.uid);
      }
    });

    // rbs01091 TheLayeredVermilionClouds [LV1-2]: at end of battle, exhaust → Clash spirit +2000 BP this turn
    if (!this.awaitingEffect) {
      const lvNexus = atkPlayer.nexuses.find((n) => n.cardId === "rbs01091TheLayeredVermilionClouds" && !n.exhausted);
      if (lvNexus && getCardLevel(lvNexus, CARD_POOL[lvNexus.cardId]) >= 1) {
        const clashSpirits = atkPlayer.spirits.filter((s) => hasClash(s.cardId));
        if (clashSpirits.length) {
          lvNexus.exhausted = true;
          if (atkPlayer.isAi) {
            const best = [...clashSpirits].sort((a, b) => getEffectiveBP(b, CARD_POOL[b.cardId]) - getEffectiveBP(a, CARD_POOL[a.cardId]))[0];
            best.bpBoost = (best.bpBoost ?? 0) + 2000;
            this.addLog(`${lvNexus.name}: ${best.name} +2000 BP this turn.`);
          } else {
            this.awaitingEffect = {
              type: "bpBoostOwnClashSpirit2000",
              label: `${lvNexus.name}: Target Clash Spirit +2000 BP this turn`,
              ownerId: atkPlayer.id,
              validTargets: clashSpirits.map((s) => s.uid),
              optional: true,
              pendingBattleAttackerUid: null,
            };
          }
        }
      }
    }
    // rbs01100/rbs01102 DualFlowDesert/RockPit [LV2 TR]: after Amplify battle, core from Trash to own spirit
    if (!this.awaitingEffect && hasAmplify(attacker.cardId)) {
      const dfNexus = atkPlayer.nexuses.find((n) =>
        (n.cardId === "rbs01100TheDualFlowDesert" || n.cardId === "rbs01102RockPit") && !n._oncePerTurnUsed
      );
      if (dfNexus && getCardLevel(dfNexus, CARD_POOL[dfNexus.cardId]) >= 2 && atkPlayer.trashCore.normal > 0) {
        dfNexus._oncePerTurnUsed = true;
        if (atkPlayer.isAi) {
          const tgt = [...atkPlayer.spirits].sort((a, b) => getEffectiveBP(b, CARD_POOL[b.cardId]) - getEffectiveBP(a, CARD_POOL[a.cardId]))[0];
          if (tgt) {
            atkPlayer.trashCore.normal -= 1;
            tgt.cores.normal += 1;
            this.addLog(`${dfNexus.name}: core from Trash → ${tgt.name} (Amplify battle).`);
          }
        } else {
          this.awaitingEffect = {
            type: "coreFromTrashToOwnSpirit",
            label: `${dfNexus.name}: Core from Trash to own Spirit`,
            ownerId: atkPlayer.id,
            validTargets: atkPlayer.spirits.map((s) => s.uid),
            optional: true,
            pendingBattleAttackerUid: null,
          };
        }
      }
    }

    if (stillAlive) {
      if (stillAlive._drawOnBattleEnd && atkPlayer.hand.length <= 5) {
        draw(atkPlayer, 1);
        this.addLog(`${stillAlive.name}: drew 1 card.`);
      }
      if (stillAlive._refreshAfterBattle) {
        stillAlive.exhausted = false;
        delete stillAlive._refreshAfterBattle;
        this.addLog(`${stillAlive.name}: refreshed after battle.`);
      }
      if (stillAlive._bonusLifeReduction && !blockerUid) {
        this._reduceLife(defPlayer, 1);
        this.addLog(`${stillAlive.name}: bonus life reduction.`);
        if (defPlayer.life <= 0) this.winner = atkPlayer.id;
      }
      stillAlive.bpBoost = 0;
      delete stillAlive._drawOnBattleEnd;
      delete stillAlive._bonusLifeReduction;
      delete stillAlive._cantBeBlockedBPLimit;
      delete stillAlive._cantBeBlockedCostLimit;
      delete stillAlive._forceExhaustedBlock;
      delete stillAlive._prevBlockerBP;
      delete stillAlive._extraLifeReductionOnWin;
      delete stillAlive._drawTwoOnAttackWin;
    }
    // Clear battle-only flags from all spirits
    [...atkPlayer.spirits, ...defPlayer.spirits].forEach((s) => {
      delete s._magicImmune;
      delete s._coreFloorOne;
    });
    return { ok: true };
  }

  declareAttack(attackerUid, aiBlockChooser) {
    const verdict = this.canAttack(attackerUid);
    if (!verdict.ok) return verdict;
    const { attacker } = verdict;
    attacker.exhausted = true;
    this.addLog(`${attacker.name} declares attack.`);

    const player = this.activePlayer();
    const card = CARD_POOL[attacker.cardId];
    const level = getCardLevel(attacker, card);
    CARD_EFFECTS[attacker.cardId]?.onAttack?.(this, attacker, player, level, attackerUid);
    // Nexus triggers when a spirit attacks
    player.nexuses.forEach((n) => {
      CARD_EFFECTS[n.cardId]?.onSpiritAttack?.(this, n, player, attacker);
    });

    if (this.awaitingEffect) {
      this._pendingAiBlockChooser = aiBlockChooser;
      return { ok: true, awaitingEffect: true };
    }
    // Open Flash window — skip automatically if no actions exist
    this._pendingAiBlockChooser = aiBlockChooser;
    this.awaitingFlash = { attackerUid };
    if (!this._hasAnyFlashAction()) {
      this.awaitingFlash = null;
      return this._proceedToBattle(attackerUid, aiBlockChooser);
    }
    return { ok: true, awaitingFlash: true };
  }

  _canBlock(attackerUid, blockerUid) {
    const atkPlayer = this.activePlayer();
    const attacker = atkPlayer.spirits.find((s) => s.uid === attackerUid);
    if (!attacker) return true;
    const defPlayer = this.defendingPlayer();
    const blocker = defPlayer.spirits.find((s) => s.uid === blockerUid);
    if (!blocker) return true;
    if (attacker._cantBeBlockedBPLimit) {
      const bp = getEffectiveBP(blocker, CARD_POOL[blocker.cardId]);
      if (bp <= attacker._cantBeBlockedBPLimit) return false;
    }
    if (attacker._cantBeBlockedCostLimit) {
      const cost = CARD_POOL[blocker.cardId]?.cost ?? 0;
      if (cost <= attacker._cantBeBlockedCostLimit) return false;
    }
    // AI refuses to pay the exhaust cost to block
    if (attacker._requiresOpponentExhaustToBlock && defPlayer.isAi) return false;
    // rbs01094: Shamanism spirit can't be blocked by Cost≤3
    if (hasShamanism(attacker.cardId)) {
      if (atkPlayer.nexuses.some((n) => n.cardId === "rbs01094ThePenetratingMountainRange")) {
        const blockerCost = CARD_POOL[blocker.cardId]?.cost ?? 0;
        if (blockerCost <= 3) return false;
      }
    }
    // rbs01100/rbs01102: Amplify spirit can't be blocked by Cost≤2
    if (hasAmplify(attacker.cardId)) {
      if (atkPlayer.nexuses.some((n) => n.cardId === "rbs01100TheDualFlowDesert" || n.cardId === "rbs01102RockPit")) {
        const blockerCost = CARD_POOL[blocker.cardId]?.cost ?? 0;
        if (blockerCost <= 2) return false;
      }
    }
    return true;
  }

  _proceedToBattle(attackerUid, aiBlockChooser) {
    const defender = this.defendingPlayer();
    if (defender.isAi) {
      let blockerUid = aiBlockChooser ? aiBlockChooser(this.getState(), attackerUid) : null;
      if (blockerUid && !this._canBlock(attackerUid, blockerUid)) blockerUid = null;
      return this.resolveBattle(attackerUid, blockerUid);
    }
    this.awaitingBlock = { attackerUid, defenderId: defender.id };
    return { ok: true, awaitingBlock: true };
  }

  defendWith(blockerUidOrNull) {
    if (!this.awaitingBlock) return { ok: false, reason: "No pending block." };
    const { attackerUid } = this.awaitingBlock;
    if (blockerUidOrNull) {
      const defPlayer = this.defendingPlayer();
      const blocker = defPlayer.spirits.find((s) => s.uid === blockerUidOrNull);
      if (blocker?._cantBlockThisTurn) return { ok: false, reason: "That Spirit can't block this turn." };
    }
    const atkPlayer = this.activePlayer();
    const attacker = atkPlayer.spirits.find((s) => s.uid === attackerUid);
    // Clash: defender must block if possible
    if (!blockerUidOrNull && attacker?._clashActive) {
      const defPlayer = this.defendingPlayer();
      const hasValidBlocker = defPlayer.spirits.some((s) => !s.exhausted && this._canBlock(attackerUid, s.uid));
      if (hasValidBlocker) return { ok: false, reason: "Clash — must block if possible." };
    }
    if (blockerUidOrNull && attacker?._requiresOpponentExhaustToBlock) {
      const defPlayer = this.defendingPlayer();
      const others = defPlayer.spirits.filter((s) => s.uid !== blockerUidOrNull && !s.exhausted);
      if (!others.length) return { ok: false, reason: "Must exhaust another Spirit to block — none available." };
      this.awaitingBlock = null;
      this.awaitingEffect = {
        type: "exhaustToBlock",
        label: "Gigantherion: Exhaust a Spirit to block",
        pendingAttackerUid: attackerUid,
        pendingBlockerUid: blockerUidOrNull,
        ownerId: defPlayer.id,
        validTargets: others.map((s) => s.uid),
        optional: false,
        pendingBattleAttackerUid: null,
      };
      return { ok: true, awaitingEffect: true };
    }
    this.awaitingBlock = null;
    return this.resolveBattle(attackerUid, blockerUidOrNull);
  }

  nextPhase() {
    if (this.winner !== null || this.awaitingBlock || this.awaitingEffect || this.awaitingFlash) return;
    const skipFirst = this.turnNumber === 0 && this.currentPlayer === 0;
    const current = PHASE_ORDER[this.phaseIndex];
    if (current === PHASES.MAIN) {
      if (skipFirst) { this.endTurn(); return; }
      this._triggerStartOpposingAttackStep();
      if (this.awaitingEffect) return;
      this._triggerStartAttackStep();
      this.phaseIndex = 1;
      return;
    }
    if (current === PHASES.ATTACK) { this.phaseIndex = 2; return; }
    this._triggerEndStep();
    this.endTurn();
  }

  _triggerStartAttackStep() {
    const player = this.activePlayer();
    player.spirits.forEach((s) => {
      const card = CARD_POOL[s.cardId];
      const level = getCardLevel(s, card);
      CARD_EFFECTS[s.cardId]?.onStartAttackStep?.(this, s, player, level);
    });
    player.nexuses.forEach((n) => {
      const level = getCardLevel(n, CARD_POOL[n.cardId]);
      CARD_EFFECTS[n.cardId]?.onStartAttackStep?.(this, n, player, level);
    });
  }

  _triggerStartOpposingAttackStep() {
    const defPlayer = this.defendingPlayer();
    defPlayer.spirits.forEach((s) => {
      const card = CARD_POOL[s.cardId];
      const level = getCardLevel(s, card);
      CARD_EFFECTS[s.cardId]?.onStartOpposingAttackStep?.(this, s, defPlayer, level);
    });
  }

  _triggerEndStep() {
    const player = this.activePlayer();
    player.spirits.forEach((s) => {
      const card = CARD_POOL[s.cardId];
      const level = getCardLevel(s, card);
      CARD_EFFECTS[s.cardId]?.onEndStep?.(this, s, player, level);
    });
    player.nexuses.forEach((n) => {
      const level = getCardLevel(n, CARD_POOL[n.cardId]);
      CARD_EFFECTS[n.cardId]?.onEndStep?.(this, n, player, level);
    });
  }

  // --- Flash window ---

  _hasAnyFlashAction() {
    if (!this.awaitingFlash) return false;
    const human = this.players[0];
    // Flash magic in hand
    for (let i = 0; i < human.hand.length; i++) {
      if (this.canPlayFlashMagic(i).ok) return true;
    }
    if (this.currentPlayer === 0) {
      // Invoke Flash on attacker (human attacking)
      if (this.canInvokeFlash(this.awaitingFlash.attackerUid).ok) return true;
      // Nexus Flash (human attacking)
      for (const n of human.nexuses) {
        if (this.canInvokeNexusFlash(n.uid).ok) return true;
      }
    } else {
      // Defender flash summon (human defending against AI attack)
      for (let i = 0; i < human.hand.length; i++) {
        if (this.canFlashSummon(i).ok) return true;
      }
    }
    return false;
  }

  canFlashSummon(handIndex) {
    if (!this.awaitingFlash) return { ok: false, reason: "Not in Flash window." };
    if (this.currentPlayer === 0) return { ok: false, reason: "Only available during opposing attack step." };
    const player = this.players[0];
    const cardId = player.hand[handIndex];
    const card = CARD_POOL[cardId];
    if (!card || card.type !== "spirit") return { ok: false, reason: "Not a spirit." };
    const hasFlashEffect = card.effects?.some(
      (e) => typeof e.condition === "string" && e.condition.includes("Flash") && e.condition.includes("Opposing Attack Step"),
    );
    if (!hasFlashEffect) return { ok: false, reason: "No flash summon effect." };
    const reduction = Math.min(card.reduction, countSymbols(player, card.color));
    const actualCost = Math.max(0, card.cost - reduction);
    const lv1Min = card.levels?.[0]?.cores ?? 1;
    // Flash: only reserve available (no auto-move from field during battle step)
    if (totalReserve(player) < actualCost + lv1Min) return { ok: false, reason: "Not enough cores." };
    return { ok: true, actualCost, card, lv1Min };
  }

  flashSummon(handIndex, { coresToPlace } = {}) {
    const verdict = this.canFlashSummon(handIndex);
    if (!verdict.ok) return verdict;
    const { actualCost, card, lv1Min } = verdict;
    const player = this.players[0];
    const placement = coresToPlace ?? lv1Min;
    const needSoulForPayment = player.reserve.normal < actualCost && player.reserve.soul;
    if (!this.payFromReserve(player, actualCost, needSoulForPayment)) return { ok: false, reason: "Payment failed." };
    const [cardId] = player.hand.splice(handIndex, 1);
    const spirit = makeSpiritFromCard(cardId, player.id, this.turnNumber, 0);
    player.spirits.push(spirit);
    this.placeCoresOnSpirit(player, spirit, placement);
    this.addLog(`${player.name} flash summons ${card.name} (cost ${actualCost}).`);
    CARD_EFFECTS[cardId]?.onSummon?.(this, spirit, player);
    return { ok: true };
  }

  passFlash() {
    if (!this.awaitingFlash) return { ok: false, reason: "No flash window." };
    const { attackerUid } = this.awaitingFlash;
    this.awaitingFlash = null;
    return this._proceedToBattle(attackerUid, this._pendingAiBlockChooser);
  }

  canPlayFlashMagic(handIndex) {
    if (!this.awaitingFlash) return { ok: false, reason: "Not in Flash window." };
    if (this.awaitingEffect) return { ok: false, reason: "Resolve pending effect first." };
    // Both players can use Flash — use the human player (0) if AI is active
    const player = this.players[0].isAi ? this.players[1] : this.players[0];
    const cardId = player.hand[handIndex];
    const card = CARD_POOL[cardId];
    if (!card || card.type !== "magic") return { ok: false, reason: "Not a magic card." };
    if (!card.effects?.some((e) => e.condition === "Flash")) return { ok: false, reason: "No Flash effect." };
    const reduction = Math.min(card.reduction, countSymbols(player, card.color));
    // Soul Magic: pay with just Soul Core if player has red symbol
    const isSoulMagic = card.keyword === "Soul Magic"
      && player.reserve.soul && countSymbols(player, card.color) > 0;
    const actualCost = isSoulMagic ? 0 : Math.max(0, card.cost - reduction);
    if (!isSoulMagic && totalFieldCores(player) < actualCost) return { ok: false, reason: "Not enough cores." };
    return { ok: true, actualCost, isSoulMagic, card, player };
  }

  playFlashMagic(handIndex, targetUid = null, paySpec = null) {
    const verdict = this.canPlayFlashMagic(handIndex);
    if (!verdict.ok) return verdict;
    const { actualCost, isSoulMagic, card, player } = verdict;
    const handler = MAGIC_FLASH_EFFECTS[player.hand[handIndex]];
    const targets = handler?.getFlashTargets?.(this, player) ?? [];

    if (targets.length > 0 && targetUid === null) {
      if (player.isAi) {
        targetUid = targets[0].uid;
      } else {
        this.awaitingEffect = {
          type: "selectFlashTarget",
          label: `${card.name} (Flash): Select target`,
          handIndex,
          paySpec,
          ownerId: player.id,
          validTargets: targets.map((t) => t.uid),
          optional: false,
          pendingBattleAttackerUid: null,
        };
        return { ok: true, awaitingTarget: true };
      }
    }

    if (isSoulMagic) {
      player.reserve.soul = false; player.trashCore.soul = true;
    } else if (paySpec) {
      if (_specTotal(paySpec) !== actualCost) return { ok: false, reason: `Pay exactly ${actualCost} cores.` };
      _applyPaySpec(player, paySpec);
      this._checkAndDestroyDepleted(player);
    } else {
      this.autoMoveCoresToReserve(player, actualCost);
      this._checkAndDestroyDepleted(player);
      this.payFromReserve(player, actualCost);
    }
    const cardId = player.hand.splice(handIndex, 1)[0];
    player.trash.push(cardId);
    this.addLog(`${player.name} plays ${card.name} (Flash, cost ${actualCost}${isSoulMagic ? ", Soul Magic" : ""}).`);
    handler?.flash?.(this, player, targetUid);
    if (isTopaz(cardId)) player._usedTopazMagicThisTurn = true;
    // Trigger onMagicPlay for player's spirits (covers Opposing Attack Step effects)
    player.spirits.forEach((s) => {
      const sl = getCardLevel(s, CARD_POOL[s.cardId]);
      CARD_EFFECTS[s.cardId]?.onMagicPlay?.(this, s, player, sl, cardId);
    });
    // Trigger onNexusMagicPlay for player's nexuses
    player.nexuses.forEach((n) => {
      const nl = getCardLevel(n, CARD_POOL[n.cardId]);
      CARD_EFFECTS[n.cardId]?.onNexusMagicPlay?.(this, n, player, nl, cardId);
    });
    return { ok: true };
  }

  canInvokeFlash(spiritUid) {
    if (!this.awaitingFlash) return { ok: false };
    if (this.awaitingEffect) return { ok: false };
    if (spiritUid !== this.awaitingFlash.attackerUid) return { ok: false, reason: "Only the attacker can invoke." };
    const player = this.activePlayer();
    const spirit = player.spirits.find((s) => s.uid === spiritUid);
    if (!spirit) return { ok: false };
    const h = INVOKE_FLASH_HANDLERS[spirit.cardId];
    if (!h?.canInvoke(spirit, player)) return { ok: false, reason: "Cannot invoke Flash." };
    return { ok: true, spirit, player };
  }

  invokeFlash(spiritUid) {
    const verdict = this.canInvokeFlash(spiritUid);
    if (!verdict.ok) return verdict;
    const { spirit, player } = verdict;
    INVOKE_FLASH_HANDLERS[spirit.cardId].invoke(this, spirit, player);
    return { ok: true };
  }

  canInvokeNexusFlash(nexusUid) {
    if (!this.awaitingFlash) return { ok: false };
    if (this.awaitingEffect) return { ok: false };
    const { attackerUid } = this.awaitingFlash;
    const player = this.activePlayer();
    const nexus = player.nexuses.find((n) => n.uid === nexusUid);
    if (!nexus) return { ok: false };
    const h = NEXUS_FLASH_HANDLERS[nexus.cardId];
    if (!h?.canInvoke(nexus, player, attackerUid)) return { ok: false };
    return { ok: true, nexus, player };
  }

  invokeNexusFlash(nexusUid) {
    const verdict = this.canInvokeNexusFlash(nexusUid);
    if (!verdict.ok) return verdict;
    const { nexus, player } = verdict;
    NEXUS_FLASH_HANDLERS[nexus.cardId].invoke(this, nexus, player, this.awaitingFlash.attackerUid);
    return { ok: true };
  }

  canInvokeNexusMain(nexusUid) {
    const phase = PHASE_ORDER[this.phaseIndex];
    if (phase !== PHASES.MAIN && phase !== PHASES.MAIN2) return { ok: false };
    if (this.awaitingEffect) return { ok: false };
    const player = this.activePlayer();
    const nexus = player.nexuses.find((n) => n.uid === nexusUid);
    if (!nexus) return { ok: false };
    const h = NEXUS_INVOKE_MAIN_HANDLERS[nexus.cardId];
    if (!h?.canInvoke(nexus, player)) return { ok: false };
    return { ok: true, nexus, player };
  }

  invokeNexusMain(nexusUid, targetUid = null) {
    const verdict = this.canInvokeNexusMain(nexusUid);
    if (!verdict.ok) return verdict;
    const { nexus, player } = verdict;
    NEXUS_INVOKE_MAIN_HANDLERS[nexus.cardId].invoke(this, nexus, player, targetUid);
    return { ok: true };
  }

  // Reduce player's life by `amount`; add cores equal to actual loss to their reserve. Returns actual loss.
  _reduceLife(player, amount) {
    const before = player.life;
    player.life = Math.max(0, player.life - amount);
    const lost = before - player.life;
    if (lost > 0) player.reserve.normal += lost;
    return lost;
  }

  // Apply BP penalty to target; destroy if BP reaches 0. Returns true if destroyed.
  _bpDamage(opp, targetUid, amount) {
    const target = opp.spirits.find((s) => s.uid === targetUid);
    if (!target) return false;
    target.bpBoost = (target.bpBoost ?? 0) - amount;
    const bp = getEffectiveBP(target, CARD_POOL[target.cardId]);
    if (bp <= 0) { this.destroySpirit(opp, target.uid); return true; }
    return false;
  }

  // Send n non-soul cores from target to their reserve. Returns true if spirit depleted (cores.normal===0).
  _sendCores(opp, targetUid, n) {
    const target = opp.spirits.find((s) => s.uid === targetUid);
    if (!target) return false;
    let send = Math.min(n, target.cores.normal);
    // rbs01091 LV2: blocking spirit cores can't go below 1 total
    if (target._coreFloorOne) {
      const total = target.cores.normal + (target.cores.soul ? 1 : 0);
      send = Math.min(send, Math.max(0, total - 1));
    }
    if (send <= 0) return false;
    target.cores.normal -= send;
    opp.reserve.normal += send;
    const lv1Min = CARD_POOL[target.cardId]?.levels?.[0]?.cores ?? 1;
    const depleted = target.cores.normal + (target.cores.soul ? 1 : 0) < lv1Min;
    if (depleted) {
      this.activePlayer()._depletedOpponentThisTurn = true;
      this.destroySpirit(opp, target.uid);
    }
    return depleted;
  }

  // Drain all non-soul cores from target until 1 remains.
  _drainToOne(opp, targetUid) {
    const target = opp.spirits.find((s) => s.uid === targetUid);
    if (!target) return;
    const drain = Math.max(0, target.cores.normal - 1);
    target.cores.normal -= drain;
    opp.reserve.normal += drain;
  }

  // Return a spirit from the field back to its owner's hand.
  _returnToHand(opp, targetUid) {
    const idx = opp.spirits.findIndex((s) => s.uid === targetUid);
    if (idx < 0) return;
    const s = opp.spirits.splice(idx, 1)[0];
    opp.reserve.normal += s.cores.normal;
    if (s.cores.soul) opp.reserve.soul = true;
    opp.hand.push(s.cardId);
    this.addLog(`${s.name} returned to hand.`);
  }

  // Return a spirit to its owner's deckbottom.
  _returnToDeckBottom(opp, targetUid) {
    const idx = opp.spirits.findIndex((s) => s.uid === targetUid);
    if (idx < 0) return;
    const s = opp.spirits.splice(idx, 1)[0];
    opp.reserve.normal += s.cores.normal;
    if (s.cores.soul) opp.reserve.soul = true;
    opp.deck.push(s.cardId);
    this.addLog(`${s.name} returned to deckbottom.`);
  }

  _destroyNexus(player, nexusUid) {
    const idx = player.nexuses.findIndex((n) => n.uid === nexusUid);
    if (idx < 0) return;
    const nx = player.nexuses[idx];
    CARD_EFFECTS[nx.cardId]?.onNexusDestroyed?.(this, nx, player);
    player.nexuses.splice(idx, 1);
    player.reserve.normal += nx.cores.normal;
    if (nx.cores.soul) player.reserve.soul = true;
    this.addLog(`${nx.name} destroyed.`);
  }

  _coreFromVoidToSpirit(player, uid) {
    const t = player.spirits.find((s) => s.uid === uid);
    if (!t) return;
    t.cores.normal += 1;
    this.addLog(`Core from Void → ${t.name}.`);
  }

  _refreshSpirit(player, uid) {
    const t = player.spirits.find((s) => s.uid === uid);
    if (!t) return;
    t.exhausted = false;
    this.addLog(`${t.name} refreshed.`);
  }

  _destroyOwnSpirit(player, uid) {
    const idx = player.spirits.findIndex((s) => s.uid === uid);
    if (idx < 0) return;
    const s = player.spirits.splice(idx, 1)[0];
    player.reserve.normal += s.cores.normal;
    if (s.cores.soul) player.reserve.soul = true;
    this.addLog(`${s.name} destroyed.`);
  }

  endTurn() {
    this.addLog(`${this.activePlayer().name} ends turn.`);
    this.currentPlayer = this.currentPlayer === 0 ? 1 : 0;
    this.turnNumber += 1;
    this.startTurn();
  }
}

export { PHASES, PHASE_ORDER, CARD_POOL };
