import { CARD_POOL } from "../data/cards.js";
import { getCardLevel, getEffectiveBP, hasFamily, draw } from "./card-utils.js";

function isAncientDragon(id) { return hasFamily(id, "Ancient Dragon"); }
function isDragon(id) { return hasFamily(id, "Dragon"); }

// Helper: destroy a nexus by uid
function _destroyNexusHelper(game, player, uid) {
  const idx = player.nexuses.findIndex((n) => n.uid === uid);
  if (idx < 0) return;
  const nx = player.nexuses.splice(idx, 1)[0];
  player.reserve.normal += nx.cores.normal;
  if (nx.cores.soul) player.reserve.soul = true;
  game.addLog(`Nexus ${nx.name} destroyed.`);
}

// Helper: return spirit to hand
function returnSpiritToHand(opp, spirit) {
  const idx = opp.spirits.findIndex((s) => s.uid === spirit.uid);
  if (idx < 0) return false;
  const s = opp.spirits.splice(idx, 1)[0];
  opp.hand.push(s.cardId);
  opp.reserve.normal += s.cores.normal;
  if (s.cores.soul) opp.reserve.soul = true;
  return true;
}

// ─────────────────────────────────────────────
// BS01 CARD_EFFECTS
// ─────────────────────────────────────────────
export const BS01_CARD_EFFECTS = {

  // === Red Spirits ===

  bs01003Teranosaber: {
    onStartOpposingAttackStep(_game, spirit, _player, level) {
      if (level >= 1) spirit._cantBlockThisTurn = true;
    },
  },
  bs01003TeranosaberRevival: {
    onStartOpposingAttackStep(_game, spirit) {
      spirit._cantBlockThisTurn = true;
    },
  },

  bs01004TheScoutDragno: {
    onAttack(game, spirit) {
      spirit.bpBoost = (spirit.bpBoost ?? 0) + 2000;
      game.addLog(`${spirit.name}: +2000 BP.`);
    },
  },
  bs01004TheScoutDragnoRevival: {
    onAttack(game, spirit) {
      spirit.bpBoost = (spirit.bpBoost ?? 0) + 5000;
      game.addLog(`${spirit.name}: +5000 BP.`);
    },
  },

  bs01007Hummerdrake: {
    onSummon(game, _spirit, player) {
      const s = player.spirits.find((x) => x.cores.normal > 0);
      if (s) { s.cores.normal -= 1; game.addLog(`${CARD_POOL.bs01007Hummerdrake?.name}: core from ${s.name} → Void.`); }
      else if (player.trashCore.normal > 0) { player.trashCore.normal -= 1; game.addLog(`Hummerdrake: core from Trash → Void.`); }
    },
  },
  bs01007HummerdrakeRevival: {
    onSummon(game, _spirit, player) {
      const s = player.spirits.find((x) => x.cores.normal > 0);
      if (s) { s.cores.normal -= 1; game.addLog(`Hummerdrake (R): core from ${s.name} → Void.`); }
      else if (player.trashCore.normal > 0) { player.trashCore.normal -= 1; game.addLog(`Hummerdrake (R): core from Trash → Void.`); }
    },
  },

  bs01009VolcBaboon: {
    onStartOpposingAttackStep(_game, spirit) { spirit._cantBlockThisTurn = true; },
  },
  bs01009VolcBaboonRevival: {
    onStartOpposingAttackStep(_game, spirit) { spirit._cantBlockThisTurn = true; },
  },

  bs01010Chakrambat: {
    onAttack(game, spirit) {
      spirit.bpBoost = (spirit.bpBoost ?? 0) + 4000;
      game.addLog(`${spirit.name}: +4000 BP.`);
    },
  },
  bs01010ChakrambatRevival: {
    onAttack(game, spirit, player) {
      spirit.bpBoost = (spirit.bpBoost ?? 0) + 4000;
      game.addLog(`${spirit.name}: +4000 BP.`);
      if (spirit.cores.soul) {
        spirit.cores.soul = false;
        player.trashCore.soul = true;
        draw(player, 1);
        game.addLog(`${spirit.name}: drew 1 card (Soul Core).`);
      }
    },
  },

  bs01011Dragsaurus: {
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
          sourceUid: spirit.uid, ownerId: player.id,
          validTargets: opp.nexuses.map((n) => n.uid), optional: false, pendingBattleAttackerUid: null,
        };
      }
    },
  },
  bs01011DragsaurusRevival: {
    onSummon(game, spirit, player) {
      const opp = game._opp(player);
      if (!opp.nexuses.length) return;
      if (player.isAi) {
        const nx = opp.nexuses[0];
        game._destroyNexus(opp, nx.uid);
        game.addLog(`${spirit.name}: destroyed ${nx.name}.`);
        if (spirit.cores.soul) {
          const tgt = opp.spirits.find((s) => getEffectiveBP(s, CARD_POOL[s.cardId]) <= 3000);
          if (tgt) { game.destroySpirit(opp, tgt.uid); game.addLog(`${spirit.name}: destroyed ${tgt.name} (Soul Core).`); }
        }
      } else {
        game.awaitingEffect = {
          type: "destroyNexus", label: `${spirit.name}: Destroy opposing Nexus`,
          sourceUid: spirit.uid, ownerId: player.id,
          validTargets: opp.nexuses.map((n) => n.uid), optional: false, pendingBattleAttackerUid: null,
        };
      }
    },
  },

  bs01016SkeltonJaw: {
    onStartOpposingAttackStep(_game, spirit) { spirit._cantBlockThisTurn = true; },
    onAttack(game, spirit, player, level) {
      if (level < 2) return;
      const count = game._opp(player).spirits.filter((s) => !s.exhausted).length;
      if (!count) return;
      spirit.bpBoost = (spirit.bpBoost ?? 0) + count * 1000;
      game.addLog(`${spirit.name}: +${count * 1000} BP (${count} refreshed opp spirits, LV2).`);
    },
  },
  bs01016SkeltonJawRevival: {
    onStartOpposingAttackStep(_game, spirit) { spirit._cantBlockThisTurn = true; },
    onAttack(game, spirit, player, level) {
      if (level < 2) return;
      const count = game._opp(player).spirits.length;
      if (!count) return;
      spirit.bpBoost = (spirit.bpBoost ?? 0) + count * 2000;
      game.addLog(`${spirit.name}: +${count * 2000} BP (${count} opp spirits, LV2).`);
    },
  },

  bs01017Lanceraptor: {
    onSummon(game, spirit, player) {
      const opp = game._opp(player);
      const targets = opp.spirits.filter((s) => getEffectiveBP(s, CARD_POOL[s.cardId]) <= 2000);
      if (!targets.length) return;
      game._effectOrAuto(player, targets, spirit.uid, null, `${spirit.name}: Destroy opposing ≤2000 BP Spirit`, true);
    },
  },
  bs01017LanceraptorRevival: {
    onSummon(game, spirit, player) {
      const opp = game._opp(player);
      const limit = spirit.cores.soul ? 10000 : 2000;
      const targets = opp.spirits.filter((s) => getEffectiveBP(s, CARD_POOL[s.cardId]) <= limit);
      if (!targets.length) return;
      game._effectOrAuto(player, targets, spirit.uid, null, `${spirit.name}: Destroy ≤${limit} BP Spirit`, false);
    },
  },

  bs01019Jurassickle: {
    onAttack(game, spirit) {
      spirit.bpBoost = (spirit.bpBoost ?? 0) + 4000;
      game.addLog(`${spirit.name}: +4000 BP.`);
    },
  },
  bs01019JurassickleRevival: {
    onAttack(game, spirit) {
      spirit.bpBoost = (spirit.bpBoost ?? 0) + 6000;
      game.addLog(`${spirit.name}: +6000 BP.`);
    },
  },

  bs01022TheSickleFoolJoker: {
    onAttack(game, spirit, player, level, attackerUid) {
      if (level < 2) return;
      const opp = game._opp(player);
      const targets = opp.spirits.filter((s) => getEffectiveBP(s, CARD_POOL[s.cardId]) <= 3000);
      if (!targets.length) return;
      game._effectOrAuto(player, targets, spirit.uid, attackerUid, `${spirit.name}: Destroy ≤3000 BP Spirit`, true);
    },
  },
  bs01022TheSickleFoolJokerRevival: {
    onAttack(game, spirit, player, level, attackerUid) {
      if (level < 2) return;
      const opp = game._opp(player);
      const limit = spirit.cores.soul ? 13000 : 3000;
      const targets = opp.spirits.filter((s) => getEffectiveBP(s, CARD_POOL[s.cardId]) <= limit);
      if (!targets.length) return;
      game._effectOrAuto(player, targets, spirit.uid, attackerUid, `${spirit.name}: Destroy ≤${limit} BP Spirit`, true);
    },
  },

  bs01024TheCrystalDragonDiamat: {
    onSummon(game, spirit, player) {
      const opp = game._opp(player);
      const targets = opp.spirits.filter((s) => !s.cores.soul);
      if (!targets.length) return;
      game._effectOrAuto(player, targets, spirit.uid, null, `${spirit.name}: Destroy Spirit without Soul Core`, true);
    },
  },

  bs01025TheDragonicFortressGiga: {
    onSummon(game, spirit, player) {
      const opp = game._opp(player);
      const targets = opp.spirits.filter((s) => getEffectiveBP(s, CARD_POOL[s.cardId]) <= 6000);
      if (!targets.length) return;
      game._effectOrAuto(player, targets, spirit.uid, null, `${spirit.name}: Destroy ≤6000 BP Spirit`, true);
    },
  },
  bs01025TheDragonicFortressGigaRevival: {
    onSummon(game, spirit, player) {
      const opp = game._opp(player);
      const targets = opp.spirits.filter((s) => getEffectiveBP(s, CARD_POOL[s.cardId]) <= 12000);
      if (!targets.length) return;
      if (player.isAi) {
        const best = [...targets].sort((a, b) => getEffectiveBP(b, CARD_POOL[b.cardId]) - getEffectiveBP(a, CARD_POOL[a.cardId]))[0];
        game.destroySpirit(opp, best.uid);
        const n = Math.min(5, player.trashCore.normal);
        player.trashCore.normal -= n;
        spirit.cores.normal += n;
        game.addLog(`${spirit.name}: destroyed ${best.name}, +${n} cores from Trash.`);
      } else {
        game.awaitingEffect = {
          type: "destroySpirit", label: `${spirit.name}: Destroy ≤12000 BP Spirit`,
          sourceUid: spirit.uid, ownerId: player.id,
          validTargets: targets.map((t) => t.uid), optional: false, pendingBattleAttackerUid: null,
        };
      }
    },
  },

  // === Purple Spirits ===

  bs01030GripHands: {
    onSummon(game, _spirit, player) {
      draw(player, 1);
      game.addLog(`Grip-Hands: drew 1 card.`);
    },
  },
  bs01030GripHandsRevival: {
    onSummon(game, spirit, player) {
      draw(player, 1);
      game.addLog(`${spirit.name}: drew 1 card.`);
      if (spirit.cores.soul) {
        const opp = game._opp(player);
        const targets = opp.spirits.filter((s) => s.cores.normal + (s.cores.soul ? 1 : 0) <= 1);
        if (targets.length) game._effectOrAuto(player, targets, spirit.uid, null, `${spirit.name}: Destroy 1-core Spirit (Soul Core)`, false);
      }
    },
  },

  bs01034BiPython: {
    onAttack(game, _spirit, player) {
      draw(player, 1);
      game.addLog(`Bi-Python: drew 1 card.`);
    },
  },
  bs01034BiPythonRevival: {
    onAttack(game, spirit, player) {
      if (!spirit.cores.soul) return;
      spirit.cores.soul = false;
      player.trashCore.soul = true;
      draw(player, 2);
      game.addLog(`${spirit.name}: drew 2 cards (Soul Core).`);
    },
  },

  bs01036ShaZoo: {
    onDestroy(game, _spirit, player) {
      const opp = game._opp(player);
      const targets = opp.spirits.filter((s) => !s.exhausted);
      const toExhaust = targets.slice(0, 2);
      toExhaust.forEach((s) => { s.exhausted = true; game.addLog(`Sha-Zoo: exhausted ${s.name}.`); });
    },
  },
  bs01036ShaZooRevival: {
    onDestroy(game, _spirit, player) {
      const opp = game._opp(player);
      if (player.trashCore.soul) {
        let remaining = 2;
        for (const s of [...opp.spirits].sort((a, b) => b.cores.normal - a.cores.normal)) {
          if (!remaining) break;
          const n = Math.min(s.cores.normal, remaining);
          if (n > 0) { game._sendCores(opp, s.uid, n); remaining -= n; }
        }
        game.addLog(`Sha-Zoo (R): sent 2 cores from opp spirits.`);
      } else {
        opp.spirits.filter((s) => !s.exhausted).slice(0, 2).forEach((s) => {
          s.exhausted = true; game.addLog(`Sha-Zoo (R): exhausted ${s.name}.`);
        });
      }
    },
  },

  bs01037Illusiona: {
    onAttack(_game, spirit, _player, level) {
      if (level >= 2) spirit._canTargetExhaustedSpirit = true;
    },
  },
  bs01037IllusionaRevival: {
    onAttack(_game, spirit) {
      spirit._canTargetExhaustedSpirit = true;
    },
  },

  bs01040Darkwitch: {
    onAttack(game, spirit, player, level, attackerUid) {
      if (level < 2) return;
      const opp = game._opp(player);
      const targets = opp.spirits.filter((s) => s.exhausted);
      if (!targets.length) return;
      if (player.isAi) {
        const best = [...targets].sort((a, b) => getEffectiveBP(b, CARD_POOL[b.cardId]) - getEffectiveBP(a, CARD_POOL[a.cardId]))[0];
        game.destroySpirit(opp, best.uid);
        game.addLog(`${spirit.name}: destroyed ${best.name}.`);
      } else {
        game.awaitingEffect = { type: "destroySpirit", label: `${spirit.name}: Destroy exhausted Spirit`, sourceUid: spirit.uid, ownerId: player.id, validTargets: targets.map((t) => t.uid), optional: false, pendingBattleAttackerUid: attackerUid };
      }
    },
  },
  bs01040DarkwitchRevival: {
    onAttack(game, spirit, player, level, attackerUid) {
      if (level < 2) return;
      const opp = game._opp(player);
      const targets = opp.spirits.filter((s) => s.exhausted);
      if (!targets.length) return;
      if (player.isAi) {
        const best = [...targets].sort((a, b) => getEffectiveBP(b, CARD_POOL[b.cardId]) - getEffectiveBP(a, CARD_POOL[a.cardId]))[0];
        game.destroySpirit(opp, best.uid);
        game.addLog(`${spirit.name}: destroyed ${best.name}.`);
      } else {
        game.awaitingEffect = { type: "destroySpirit", label: `${spirit.name}: Destroy exhausted Spirit`, sourceUid: spirit.uid, ownerId: player.id, validTargets: targets.map((t) => t.uid), optional: false, pendingBattleAttackerUid: attackerUid };
      }
    },
  },

  bs01041Cobraiga: {
    onSummon(game, spirit, player) {
      const opp = game._opp(player);
      const targets = opp.spirits.filter((s) => s.cores.normal > 1);
      if (!targets.length) return;
      if (player.isAi) {
        const best = [...targets].sort((a, b) => b.cores.normal - a.cores.normal)[0];
        game._drainToOne(opp, best.uid);
        game.addLog(`${spirit.name}: drained ${best.name} to 1 core.`);
      } else {
        game.awaitingEffect = { type: "drainToOne", label: `${spirit.name}: Drain Spirit to 1 core`, sourceUid: spirit.uid, ownerId: player.id, validTargets: targets.map((t) => t.uid), optional: false, pendingBattleAttackerUid: null };
      }
    },
  },
  bs01041CobraigaRevival: {
    onSummon(game, spirit, player) {
      const opp = game._opp(player);
      const targets = opp.spirits.filter((s) => s.cores.normal > 1);
      if (!targets.length) return;
      if (player.isAi) {
        const best = [...targets].sort((a, b) => b.cores.normal - a.cores.normal)[0];
        game._drainToOne(opp, best.uid);
        game.addLog(`${spirit.name}: drained ${best.name} to 1 core.`);
      } else {
        game.awaitingEffect = { type: "drainToOne", label: `${spirit.name}: Drain Spirit to 1 core`, sourceUid: spirit.uid, ownerId: player.id, validTargets: targets.map((t) => t.uid), optional: false, pendingBattleAttackerUid: null };
      }
    },
  },

  bs01042Mistweasel: {
    onDestroy(game, _spirit, player) {
      draw(player, 3);
      game.addLog(`Mistweasel: drew 3 cards.`);
    },
  },
  bs01042MistweaselRevival: {
    onDestroy(game, _spirit, player) {
      draw(player, 3);
      game.addLog(`Mistweasel (R): drew 3 cards.`);
    },
  },

  bs01045TheRipperHeadiless: {
    onDestroy(game, spirit, player) {
      const idx = player.trash.lastIndexOf(spirit.cardId);
      if (idx >= 0) { player.trash.splice(idx, 1); player.hand.push(spirit.cardId); }
      game.addLog(`${spirit.name}: returned to hand.`);
    },
  },
  bs01045TheRipperHeadilessRevival: {
    onDestroy(game, spirit, player) {
      const idx = player.trash.lastIndexOf(spirit.cardId);
      if (idx >= 0) { player.trash.splice(idx, 1); player.hand.push(spirit.cardId); }
      game.addLog(`${spirit.name}: returned to hand.`);
      const opp = game._opp(player);
      let rem = 3;
      for (const s of [...opp.spirits].sort((a, b) => b.cores.normal - a.cores.normal)) {
        if (!rem) break;
        const n = Math.min(s.cores.normal, rem);
        if (n > 0) { game._sendCores(opp, s.uid, n); rem -= n; }
      }
      game.addLog(`${spirit.name}: sent 3 cores from opp.`);
    },
  },

  bs01046ThePhantomDragonSheyron: {
    onSummon(game, spirit, player) {
      const opp = game._opp(player);
      [opp, player].forEach((p) => {
        p.spirits.forEach((s) => {
          if (s.uid === spirit.uid) return;
          const excess = s.cores.normal - 1;
          if (excess > 0) { s.cores.normal = 1; p.reserve.normal += excess; }
        });
      });
      game.addLog(`${spirit.name}: all Spirits drained to 1 core.`);
    },
  },
  bs01046ThePhantomDragonSheyronRevival: {
    onSummon(game, _spirit, player) {
      const opp = game._opp(player);
      const toTrash = player.trashCore.soul && game.currentPlayer === player.id;
      opp.spirits.forEach((s) => {
        const excess = s.cores.normal - 1;
        if (excess > 0) {
          s.cores.normal = 1;
          if (toTrash) opp.trashCore.normal += excess; else opp.reserve.normal += excess;
        }
      });
      game.addLog(`Sheyron (R): opp spirits drained to 1 core.`);
    },
  },

  bs01047TheWitchNaja: {
    onAttackWin(game, spirit, player) {
      const opp = game._opp(player);
      const t = opp.spirits.find((s) => !s.exhausted);
      if (t) { t.exhausted = true; game.addLog(`${spirit.name}: exhausted ${t.name}.`); }
    },
  },
  bs01047TheWitchNajaRevival: {
    onAttackWin(game, spirit, player) {
      const opp = game._opp(player);
      let rem = 2;
      for (const s of [...opp.spirits].sort((a, b) => b.cores.normal - a.cores.normal)) {
        if (!rem) break;
        const n = Math.min(s.cores.normal, rem);
        if (n > 0) { game._sendCores(opp, s.uid, n); rem -= n; }
      }
      opp.spirits.filter((s) => !s.exhausted && s.cores.normal === 0).forEach((s) => { s.exhausted = true; });
      game.addLog(`${spirit.name}: sent 2 cores from opp + exhausted depleted.`);
    },
  },

  bs01048ThePrincessVampireVampiles: {
    onSummon(game, spirit, player) {
      const opp = game._opp(player);
      const targets = opp.spirits.filter((s) => s.exhausted);
      if (!targets.length) return;
      game._effectOrAuto(player, targets, spirit.uid, null, `${spirit.name}: Destroy exhausted Spirit`, false);
    },
  },
  bs01048ThePrincessVampireVampilesRevival: {
    onSummon(game, spirit, player) {
      const opp = game._opp(player);
      const targets = opp.spirits.filter((s) => s.exhausted);
      if (targets.length) game._effectOrAuto(player, targets, spirit.uid, null, `${spirit.name}: Destroy exhausted Spirit`, false);
      if (spirit.cores.soul) {
        const card = player.trash.find((id) => CARD_POOL[id]?.color === "purple" && CARD_POOL[id]?.type === "spirit");
        if (card) {
          player.trash.splice(player.trash.lastIndexOf(card), 1);
          player.hand.push(card);
          game.addLog(`${spirit.name}: returned ${CARD_POOL[card]?.name} to hand (Soul Core).`);
        }
      }
    },
  },

  bs01049ThePhantomKnightNightrider: {
    onAttack(game, spirit, player, level, attackerUid) {
      if (level < 2) return;
      const opp = game._opp(player);
      const targets = [
        ...opp.spirits.filter((s) => s.exhausted),
        ...player.spirits.filter((s) => s.exhausted && s.uid !== spirit.uid),
      ];
      if (!targets.length) return;
      if (player.isAi) {
        const oppEx = opp.spirits.filter((s) => s.exhausted);
        if (oppEx.length) { game.destroySpirit(opp, oppEx[0].uid); game.addLog(`${spirit.name}: destroyed ${oppEx[0].name}.`); }
      } else {
        game.awaitingEffect = { type: "destroySpirit", label: `${spirit.name}: Destroy exhausted Spirit`, sourceUid: spirit.uid, ownerId: player.id, validTargets: targets.map((s) => s.uid), optional: false, pendingBattleAttackerUid: attackerUid };
      }
    },
  },

  // === Green Spirits ===

  bs01055Emeant: {
    onDestroy(game, _spirit, player) {
      player.spirits.forEach((s) => { s.bpBoost = (s.bpBoost ?? 0) + 1000; });
      game.addLog(`Emeant: all own spirits +1000 BP.`);
    },
  },
  bs01055EmeantRevival: {
    onDestroy(game, _spirit, player) {
      player.spirits.forEach((s) => { s.bpBoost = (s.bpBoost ?? 0) + 3000; });
      game.addLog(`Emeant (R): all own spirits +3000 BP.`);
    },
  },

  bs01060Eagrass: {
    onDestroy(game, spirit, player) {
      const level = getCardLevel(spirit, CARD_POOL[spirit.cardId]);
      if (level < 2) return;
      player.spirits.forEach((s) => { s.bpBoost = (s.bpBoost ?? 0) + 2000; });
      game.addLog(`Eagrass: all own spirits +2000 BP (LV2).`);
    },
  },
  bs01060EagrassRevival: {
    onDestroy(game, spirit, player) {
      const level = getCardLevel(spirit, CARD_POOL[spirit.cardId]);
      if (level < 2) return;
      const opp = game._opp(player);
      opp.spirits.filter((s) => !s.exhausted).slice(0, 2).forEach((s) => { s.exhausted = true; game.addLog(`Eagrass (R): exhausted ${s.name}.`); });
      player.spirits.forEach((s) => { s.bpBoost = (s.bpBoost ?? 0) + 5000; });
      game.addLog(`Eagrass (R): all own spirits +5000 BP.`);
    },
  },

  bs01061Apewhip: {
    onSummon(game, _spirit, player) {
      player.reserve.normal += 1;
      game.addLog(`Apewhip: core Void → Reserve.`);
    },
  },
  bs01061ApewhipRevival: {
    onSummon(game, spirit, player) {
      player.reserve.normal += 1;
      game.addLog(`${spirit.name}: core Void → Reserve.`);
      if (spirit.cores.soul) {
        player.trashCore.normal += 2;
        game.addLog(`${spirit.name}: 2 cores Void → Trash (Soul Core).`);
      }
    },
  },

  bs01062Hungrytree: {
    onDestroy(game, _spirit, player) {
      const opp = game._opp(player);
      if (!opp.hand.length) return;
      const i = Math.floor(Math.random() * opp.hand.length);
      const card = opp.hand.splice(i, 1)[0];
      opp.trash.push(card);
      game.addLog(`Hungrytree: ${opp.name} discarded ${CARD_POOL[card]?.name ?? 'a card'}.`);
    },
  },
  bs01062HungrytreeRevival: {
    onDestroy(game, _spirit, player) {
      const opp = game._opp(player);
      if (!opp.hand.length) return;
      const i = Math.floor(Math.random() * opp.hand.length);
      const card = opp.hand.splice(i, 1)[0];
      opp.trash.push(card);
      game.addLog(`Hungrytree (R): discarded ${CARD_POOL[card]?.name ?? 'a card'}.`);
      if (opp.hand.length >= 5) {
        const j = Math.floor(Math.random() * opp.hand.length);
        const c2 = opp.hand.splice(j, 1)[0];
        opp.trash.push(c2);
        game.addLog(`Hungrytree (R): also discarded ${CARD_POOL[c2]?.name ?? 'a card'} (hand ≥5).`);
      }
    },
  },

  bs01063Emeraldscissor: {
    onSummon(game, spirit, player) {
      const opp = game._opp(player);
      const targets = opp.spirits.filter((s) => !s.exhausted);
      if (!targets.length) return;
      if (player.isAi) {
        const best = [...targets].sort((a, b) => getEffectiveBP(b, CARD_POOL[b.cardId]) - getEffectiveBP(a, CARD_POOL[a.cardId]))[0];
        best.exhausted = true;
        game.addLog(`${spirit.name}: exhausted ${best.name}.`);
      } else {
        game.awaitingEffect = { type: "exhaustSpirit", label: `${spirit.name}: Exhaust opposing Spirit`, sourceUid: spirit.uid, ownerId: player.id, validTargets: targets.map((t) => t.uid), optional: false, pendingBattleAttackerUid: null };
      }
    },
  },
  bs01063EmeraldscissorRevival: {
    onSummon(game, spirit, player) {
      const opp = game._opp(player);
      const targets = opp.spirits.filter((s) => !s.exhausted);
      if (!targets.length) return;
      if (player.isAi) {
        const best = [...targets].sort((a, b) => getEffectiveBP(b, CARD_POOL[b.cardId]) - getEffectiveBP(a, CARD_POOL[a.cardId]))[0];
        best.exhausted = true;
        game.addLog(`${spirit.name}: exhausted ${best.name}.`);
      } else {
        game.awaitingEffect = { type: "exhaustSpirit", label: `${spirit.name}: Exhaust opposing Spirit`, sourceUid: spirit.uid, ownerId: player.id, validTargets: targets.map((t) => t.uid), optional: false, pendingBattleAttackerUid: null };
      }
    },
  },

  bs01065Killikabut: {
    onSummon(game, spirit, player) {
      game._coreFromVoidToSpirit(player, spirit.uid);
      game.addLog(`${spirit.name}: core Void → self.`);
    },
  },
  bs01065KillikabutRevival: {
    onSummon(game, spirit, player) {
      const targets = player.spirits;
      if (player.isAi) {
        game._coreFromVoidToSpirit(player, spirit.uid);
        game.addLog(`${spirit.name}: core Void → self.`);
      } else {
        game.awaitingEffect = { type: "coreFromVoidToOwnSpirit", label: `${spirit.name}: Core Void → own Spirit`, sourceUid: spirit.uid, ownerId: player.id, validTargets: targets.map((t) => t.uid), optional: false, pendingBattleAttackerUid: null };
      }
    },
    onAttack(game, spirit, player, level, attackerUid) {
      if (level < 2) return;
      const opp = game._opp(player);
      const targets = opp.spirits.filter((s) => !s.exhausted);
      if (!targets.length) return;
      if (player.isAi) {
        targets[0].exhausted = true;
        game.addLog(`${spirit.name}: exhausted ${targets[0].name} (LV2).`);
      } else {
        game.awaitingEffect = { type: "exhaustSpirit", label: `${spirit.name}: Exhaust opposing Spirit (LV2)`, sourceUid: spirit.uid, ownerId: player.id, validTargets: targets.map((t) => t.uid), optional: true, pendingBattleAttackerUid: attackerUid };
      }
    },
  },

  bs01069TheAirMasterAquilers: {
    onSummon(game, spirit, player) {
      const targets = player.spirits;
      if (!targets.length) return;
      if (player.isAi) {
        game._coreFromVoidToSpirit(player, spirit.uid);
        game.addLog(`${spirit.name}: core Void → self.`);
      } else {
        game.awaitingEffect = { type: "coreFromVoidToOwnSpirit", label: `${spirit.name}: Core Void → own Spirit`, sourceUid: spirit.uid, ownerId: player.id, validTargets: targets.map((t) => t.uid), optional: false, pendingBattleAttackerUid: null };
      }
    },
  },
  bs01069TheAirMasterAquilersRevival: {
    onSummon(game, spirit, player) {
      game._coreFromVoidToSpirit(player, spirit.uid);
      game._coreFromVoidToSpirit(player, spirit.uid);
      game.addLog(`${spirit.name}: 2 cores Void → spirits.`);
    },
  },

  bs01070TheMeteoriteArmorMonoqueiroz: {
    onSummon(game, _spirit, player) {
      player.spirits.forEach((s) => { s.bpBoost = (s.bpBoost ?? 0) + 2000; });
      game.addLog(`Monoqueiroz: all own spirits +2000 BP this turn.`);
    },
  },
  bs01070TheMeteoriteArmorMonoqueirozRevival: {
    onSummon(game, _spirit, player) {
      player.spirits.forEach((s) => { s.bpBoost = (s.bpBoost ?? 0) + 10000; });
      game.addLog(`Monoqueiroz (R): all own spirits +10000 BP this turn.`);
    },
  },

  bs01071TheChargerBlanboar: {
    onAttackWin(game, spirit, _player, level) {
      if (level < 2) return;
      spirit.exhausted = false;
      game.addLog(`${spirit.name}: refreshed (attack win, LV2).`);
    },
  },
  bs01071TheChargerBlanboarRevival: {
    onAttackWin(game, spirit) {
      spirit.exhausted = false;
      if (spirit.cores.soul) spirit.bpBoost = (spirit.bpBoost ?? 0) + 5000;
      game.addLog(`${spirit.name}: refreshed on attack win.`);
    },
    onBlockWin(game, spirit) {
      spirit.exhausted = false;
      if (spirit.cores.soul) spirit.bpBoost = (spirit.bpBoost ?? 0) + 5000;
      game.addLog(`${spirit.name}: refreshed on block win.`);
    },
  },

  bs01072GowsilviaRevival: {
    onAttack(game, spirit, player, level) {
      if (level < 2) return;
      const moved = spirit.cores.normal > 0 ? spirit.cores.normal : 0;
      if (!moved) return;
      player.reserve.normal += moved;
      spirit.cores.normal = 0;
      const exhaustCount = Math.floor(moved / 2);
      const opp = game._opp(player);
      opp.spirits.filter((s) => !s.exhausted).slice(0, exhaustCount).forEach((s) => {
        s.exhausted = true; game.addLog(`${spirit.name}: exhausted ${s.name}.`);
      });
      game.addLog(`${spirit.name}: moved ${moved} cores to Reserve, exhausted ${exhaustCount} opp spirits.`);
    },
  },

  // === White Spirits ===

  bs01077BabyLoki: {
    onBlock(game, spirit, _player, level) {
      if (level < 2) return;
      spirit.bpBoost = (spirit.bpBoost ?? 0) + 1000;
      game.addLog(`${spirit.name}: +1000 BP (blocks, LV2).`);
    },
  },
  bs01077BabyLokiRevival: {
    onBlock(game, spirit, player) {
      spirit.bpBoost = (spirit.bpBoost ?? 0) + 3000;
      game.addLog(`${spirit.name}: +3000 BP (blocks).`);
      const opp = game._opp(player);
      const t = opp.spirits.find((s) => !s.exhausted);
      if (t) { t.exhausted = true; game.addLog(`${spirit.name}: exhausted ${t.name}.`); }
    },
  },

  bs01078TheAutoLadyMani: {
    onAttack(game, _spirit, player) {
      if (player.trashCore.normal > 0) {
        player.trashCore.normal -= 1;
        player.reserve.normal += 1;
        game.addLog(`Mani: core Trash → Reserve.`);
      }
    },
  },
  bs01078TheAutoLadyManiRevival: {
    onAttack(game, spirit, player) {
      spirit.bpBoost = (spirit.bpBoost ?? 0) + 3000;
      game.addLog(`${spirit.name}: +3000 BP.`);
      if (spirit.cores.soul) {
        const n = Math.min(3, player.trashCore.normal);
        player.trashCore.normal -= n;
        player.reserve.normal += n;
        game.addLog(`${spirit.name}: ${n} cores Trash → Reserve (Soul Core).`);
      }
    },
  },

  bs01080Fenrircannon: {
    onBlock(game, spirit) {
      spirit.bpBoost = (spirit.bpBoost ?? 0) + 1000;
      game.addLog(`${spirit.name}: +1000 BP (blocks).`);
    },
  },
  bs01080FenrircannonRevival: {
    onBlock(game, spirit, player) {
      spirit.bpBoost = (spirit.bpBoost ?? 0) + 5000;
      game.addLog(`${spirit.name}: +5000 BP (blocks).`);
      const other = player.spirits.find((s) => s.color === "white" && s.uid !== spirit.uid && s.exhausted);
      if (other) { other.exhausted = false; game.addLog(`${spirit.name}: refreshed ${other.name}.`); }
    },
  },

  bs01081TheSilverScaleNithhoggr: {
    onBlock(game, spirit) {
      spirit.bpBoost = (spirit.bpBoost ?? 0) + 4000;
      game.addLog(`${spirit.name}: +4000 BP (blocks).`);
    },
  },
  bs01081TheSilverScaleNithhoggrRevival: {
    onBlock(game, spirit) {
      spirit.bpBoost = (spirit.bpBoost ?? 0) + 5000;
      game.addLog(`${spirit.name}: +5000 BP (blocks).`);
    },
  },

  bs01082UrDine: {
    onAttack(game, _spirit, player) {
      player.reserve.normal += 1;
      game.addLog(`Ur-Dine: core Void → Reserve.`);
    },
  },
  bs01082UrDineRevival: {
    onAttack(game, _spirit, player) {
      player.reserve.normal += 1;
      game.addLog(`Ur-Dine (R): core Void → Reserve.`);
    },
  },

  bs01085Elephantite: {
    onBlock(game, spirit) {
      spirit.bpBoost = (spirit.bpBoost ?? 0) + 2000;
      game.addLog(`${spirit.name}: +2000 BP (blocks).`);
    },
  },
  bs01085ElephantiteRevival: {
    onBlock(game, spirit, player) {
      spirit.bpBoost = (spirit.bpBoost ?? 0) + 5000;
      game.addLog(`${spirit.name}: +5000 BP (blocks).`);
      const opp = game._opp(player);
      const targets = opp.spirits;
      if (!targets.length) return;
      if (player.isAi) {
        const best = [...targets].sort((a, b) => getEffectiveBP(b, CARD_POOL[b.cardId]) - getEffectiveBP(a, CARD_POOL[a.cardId]))[0];
        game._returnToHand(opp, best.uid);
        game.addLog(`${spirit.name}: returned ${best.name} to hand.`);
      } else {
        game.awaitingEffect = { type: "returnToHand", label: `${spirit.name}: Return opp Spirit to hand`, sourceUid: spirit.uid, ownerId: player.id, validTargets: targets.map((t) => t.uid), optional: false, pendingBattleAttackerUid: null };
      }
    },
  },

  bs01087MetaldyBug: {
    onSummon(game, _spirit, player) {
      const opp = game._opp(player);
      // Each player moves 1 core from a spirit to Trash
      const ownS = player.spirits.find((s) => s.cores.normal > 0);
      if (ownS) { ownS.cores.normal -= 1; player.trashCore.normal += 1; game.addLog(`Metaldy-Bug: ${ownS.name} −1 core → Trash.`); }
      const oppS = opp.spirits.find((s) => s.cores.normal > 0);
      if (oppS) { oppS.cores.normal -= 1; opp.trashCore.normal += 1; game.addLog(`Metaldy-Bug: ${oppS.name} −1 core → Trash.`); }
    },
  },
  bs01087MetaldyBugRevival: {
    onSummon(game, _spirit, player) {
      const opp = game._opp(player);
      const ownS = player.spirits.find((s) => s.cores.normal > 0);
      if (ownS) { ownS.cores.normal -= 1; player.trashCore.normal += 1; game.addLog(`Metaldy-Bug (R): ${ownS.name} −1 core → Trash.`); }
      const oppS = opp.spirits.find((s) => s.cores.normal > 0);
      if (oppS) { oppS.cores.normal -= 1; opp.trashCore.normal += 1; game.addLog(`Metaldy-Bug (R): ${oppS.name} −1 core → Trash.`); }
    },
    onDestroy(game, spirit, player) {
      const idx = player.trash.lastIndexOf(spirit.cardId);
      if (idx >= 0) { player.trash.splice(idx, 1); player.hand.push(spirit.cardId); game.addLog(`${spirit.name}: returned to hand on destroy.`); }
    },
  },

  bs01090HellBlindi: {
    onSummon(game, spirit, player) {
      const opp = game._opp(player);
      if (!opp.spirits.length) return;
      if (player.isAi) {
        const best = [...opp.spirits].sort((a, b) => getEffectiveBP(b, CARD_POOL[b.cardId]) - getEffectiveBP(a, CARD_POOL[a.cardId]))[0];
        game._returnToHand(opp, best.uid);
        game.addLog(`${spirit.name}: returned ${best.name} to hand.`);
      } else {
        game.awaitingEffect = { type: "returnToHand", label: `${spirit.name}: Return Spirit to hand`, sourceUid: spirit.uid, ownerId: player.id, validTargets: opp.spirits.map((t) => t.uid), optional: false, pendingBattleAttackerUid: null };
      }
    },
  },
  bs01090HellBlindiRevival: {
    onSummon(game, spirit, player) {
      const opp = game._opp(player);
      if (opp.spirits.length) {
        if (player.isAi) {
          const best = [...opp.spirits].sort((a, b) => getEffectiveBP(b, CARD_POOL[b.cardId]) - getEffectiveBP(a, CARD_POOL[a.cardId]))[0];
          game._returnToHand(opp, best.uid);
          game.addLog(`${spirit.name}: returned ${best.name} to hand.`);
        } else {
          game.awaitingEffect = { type: "returnToHand", label: `${spirit.name}: Return opp Spirit to hand`, sourceUid: spirit.uid, ownerId: player.id, validTargets: opp.spirits.map((t) => t.uid), optional: false, pendingBattleAttackerUid: null };
        }
      }
    },
  },

  bs01093TheShieldSpiritDis: {
    onDestroy(game, spirit, player) {
      const level = getCardLevel(spirit, CARD_POOL[spirit.cardId]);
      if (level < 2) return;
      const other = player.spirits.find((s) => s.uid !== spirit.uid && s.exhausted);
      if (other) { other.exhausted = false; game.addLog(`${spirit.name}: refreshed ${other.name} on destroy (LV2).`); }
    },
  },

  bs01097TheSteelWyvernValkyrious: {
    onBlock(game, spirit) {
      spirit.bpBoost = (spirit.bpBoost ?? 0) + 6000;
      game.addLog(`${spirit.name}: +6000 BP (blocks).`);
    },
  },
  bs01097TheSteelWyvernValkyriousRevival: {
    onBlock(game, spirit) {
      spirit.bpBoost = (spirit.bpBoost ?? 0) + 10000;
      game.addLog(`${spirit.name}: +10000 BP (battle).`);
    },
    onAttack(game, spirit) {
      spirit.bpBoost = (spirit.bpBoost ?? 0) + 10000;
      game.addLog(`${spirit.name}: +10000 BP (battle).`);
    },
  },

  // === X-Rare Spirits ===

  bs01X02TheSevenShogunDesperado: {
    onSummon(game, spirit, player) {
      const opp = game._opp(player);
      let coreGained = 0;
      [...opp.spirits, ...player.spirits.filter((s) => s.uid !== spirit.uid)].forEach((s) => {
        const excess = s.cores.normal - 1;
        if (excess > 0) {
          const owner = opp.spirits.includes(s) ? opp : player;
          owner.reserve.normal += excess;
          s.cores.normal = 1;
          coreGained += 1;
        }
      });
      spirit.cores.normal += coreGained;
      game.addLog(`${spirit.name}: drained all Spirits to 1 core, gained ${coreGained} cores.`);
    },
    onAttack(game, spirit, player, level, attackerUid) {
      if (level < 2) return;
      const opp = game._opp(player);
      const targets = opp.spirits.filter((s) => s.cores.normal > 1);
      if (!targets.length) return;
      if (player.isAi) {
        const best = [...targets].sort((a, b) => b.cores.normal - a.cores.normal)[0];
        game._drainToOne(opp, best.uid);
        game.addLog(`${spirit.name}: drained ${best.name} to 1 core (LV2).`);
      } else {
        game.awaitingEffect = { type: "drainToOne", label: `${spirit.name}: Drain opposing Spirit to 1 core (LV2)`, sourceUid: spirit.uid, ownerId: player.id, validTargets: targets.map((t) => t.uid), optional: false, pendingBattleAttackerUid: attackerUid };
      }
    },
  },
  bs01X02TheSevenShogunDesperadoRevival: {
    onSummon(game, spirit, player) {
      const opp = game._opp(player);
      let coreGained = 0;
      opp.spirits.forEach((s) => {
        const excess = s.cores.normal - 1;
        if (excess > 0) { opp.reserve.normal += excess; s.cores.normal = 1; coreGained += 1; }
      });
      spirit.cores.normal += coreGained;
      game.addLog(`${spirit.name}: drained opp spirits to 1 core, gained ${coreGained} cores.`);
    },
    onAttack(game, spirit, player, level, attackerUid) {
      if (level < 2) return;
      const opp = game._opp(player);
      const targets = opp.spirits.filter((s) => s.cores.normal > 1);
      if (!targets.length) return;
      if (player.isAi) {
        const best = [...targets].sort((a, b) => b.cores.normal - a.cores.normal)[0];
        game._drainToOne(opp, best.uid);
        game.addLog(`${spirit.name}: drained ${best.name} (LV2).`);
      } else {
        game.awaitingEffect = { type: "drainToOne", label: `${spirit.name}: Drain opposing Spirit to 1 core`, sourceUid: spirit.uid, ownerId: player.id, validTargets: targets.map((t) => t.uid), optional: false, pendingBattleAttackerUid: attackerUid };
      }
    },
  },

  bs01X03TheDukeKingtaurus: {
    onSummon(game, spirit, player) {
      const count = player.spirits.filter((s) => s.uid !== spirit.uid).length;
      spirit.cores.normal += count;
      game.addLog(`${spirit.name}: +${count} cores from ${count} own Spirits.`);
    },
  },
  bs01X03TheDukeKingtaurusRevival: {
    onSummon(game, spirit, player) {
      const count = player.spirits.length;
      spirit.cores.normal += count;
      game.addLog(`${spirit.name}: +${count} cores (incl. self).`);
    },
    onAttackWin(game, spirit, player) {
      const level = getCardLevel(spirit, CARD_POOL[spirit.cardId]);
      if (level < 2) return;
      const opp = game._opp(player);
      if (opp.life > 0) {
        opp.life -= 1;
        opp.trashCore.normal += 1;
        game.addLog(`${spirit.name}: 1 opp life → Trash (LV2 attack win).`);
      }
    },
  },

  bs01X04TheImpregnableFortressOdin: {
    onSummon(game, spirit, player) {
      const nexusCount = [...player.nexuses, ...game._opp(player).nexuses].length;
      spirit.bpBoost = (spirit.bpBoost ?? 0) + nexusCount * 1000;
      if (nexusCount) game.addLog(`${spirit.name}: +${nexusCount * 1000} BP (${nexusCount} nexuses on field).`);
    },
    onStartAttackStep(game, spirit, player) {
      // Nexuses can't be destroyed this turn — mark them
      player.nexuses.forEach((n) => { n._odinProtected = true; });
      game._opp(player).nexuses.forEach((n) => { n._odinProtected = true; });
      game.addLog(`${spirit.name}: all Nexuses protected this turn.`);
    },
  },

  // === BS01 Nexuses ===

  bs01098TheBurningBattlefield: {
    onSpiritAttack(game, nexus, _player, attacker) {
      attacker.bpBoost = (attacker.bpBoost ?? 0) + 1000;
      game.addLog(`${nexus.name}: attacking spirit +1000 BP.`);
    },
  },
  bs01098TheBurningBattlefieldRevival: {
    onSpiritAttack(game, nexus, _player, attacker) {
      attacker.bpBoost = (attacker.bpBoost ?? 0) + 3000;
      game.addLog(`${nexus.name}: attacking spirit +3000 BP.`);
    },
  },

  bs01099TheCanyonWhereSageLives: {
    onDrawStep(game, nexus, player, level) {
      draw(player, 1);
      game.addLog(`${nexus.name}: +1 card on draw step.`);
      if (level < 2 && player.hand.length > 0) {
        // LV1: discard a card after drawing
        if (player.isAi) {
          const card = player.hand.shift();
          player.trash.push(card);
          game.addLog(`${nexus.name}: discarded ${CARD_POOL[card]?.name ?? 'a card'} (LV1).`);
        } else {
          game.awaitingEffect = {
            type: "returnHandCardToDeckBottom",
            label: `${nexus.name}: Discard 1 card (LV1)`,
            ownerId: player.id,
            validTargets: player.hand.map((_, i) => String(i)),
            optional: false,
            pendingBattleAttackerUid: null,
          };
        }
      }
    },
  },
  bs01099TheCanyonWhereSageLivesRevival: {
    onDrawStep(game, nexus, player) {
      draw(player, 1);
      game.addLog(`${nexus.name} (R): +1 card on draw step.`);
    },
  },

  bs01106TheHermitWiseTree: {
    onSpiritAttack(game, nexus, player, attacker) {
      const exhaustedCount = player.spirits.filter((s) => s.exhausted).length;
      if (!exhaustedCount) return;
      attacker.bpBoost = (attacker.bpBoost ?? 0) + exhaustedCount * 1000;
      game.addLog(`${nexus.name}: attacking spirit +${exhaustedCount * 1000} BP (${exhaustedCount} exhausted own).`);
    },
    onEndStep(game, nexus, player, level) {
      if (level < 2) return;
      player.spirits.forEach((s) => { s.exhausted = false; });
      game.addLog(`${nexus.name}: refreshed all own spirits (LV2 end step).`);
    },
  },
  bs01106TheHermitWiseTreeRevival: {
    onSpiritAttack(game, nexus, player, attacker) {
      const exhaustedCount = player.spirits.filter((s) => s.exhausted).length;
      if (!exhaustedCount) return;
      attacker.bpBoost = (attacker.bpBoost ?? 0) + exhaustedCount * 1000;
      game.addLog(`${nexus.name} (R): battling spirit +${exhaustedCount * 1000} BP.`);
    },
    onEndStep(game, nexus, player, level) {
      if (level < 2) return;
      player.spirits.forEach((s) => {
        s.exhausted = false;
        if (nexus.cores?.soul) { game._coreFromVoidToSpirit(player, s.uid); }
      });
      game.addLog(`${nexus.name} (R): refreshed all own spirits (LV2).`);
    },
  },

  bs01107TheFruitOfLife: {
    onOwnLifeReduced(game, nexus, player) {
      draw(player, 1);
      game.addLog(`${nexus.name}: drew 1 card (life reduced).`);
    },
  },
  bs01107TheFruitOfLifeRevival: {
    onOwnLifeReduced(game, nexus, player, level) {
      draw(player, 1);
      game.addLog(`${nexus.name} (R): drew 1 card (life reduced).`);
      if (level >= 2) {
        player.reserve.normal += 1; game.addLog(`${nexus.name} (R): core Void → Reserve (LV2).`);
        const opp = game._opp(player);
        const t = opp.spirits.find((s) => !s.exhausted);
        if (t) { t.exhausted = true; game.addLog(`${nexus.name} (R): exhausted ${t.name} (LV2).`); }
      }
    },
  },

  bs01108TheAnthill: {
    onBlockWin(game, nexus, player) {
      const atk = player.spirits.find((s) => s.exhausted);
      if (atk) { atk.exhausted = false; game.addLog(`${nexus.name}: refreshed ${atk.name} (block win).`); }
    },
    onAttackWin(game, nexus, player, level) {
      if (level < 2) return;
      const atk = player.spirits.find((s) => s.exhausted);
      if (atk) { atk.exhausted = false; game.addLog(`${nexus.name}: refreshed ${atk.name} (attack win, LV2).`); }
    },
  },
  bs01108TheAnthillRevival: {
    onBlockWin(game, nexus, player) {
      const atk = player.spirits.find((s) => s.exhausted);
      if (atk) { atk.exhausted = false; game.addLog(`${nexus.name} (R): refreshed ${atk.name}.`); }
    },
    onAttackWin(game, nexus, player, level) {
      if (level < 2) return;
      const atk = player.spirits.find((s) => s.exhausted);
      if (atk) {
        atk.exhausted = false;
        game.addLog(`${nexus.name} (R): refreshed ${atk.name} (LV2).`);
        // Summon Parasite from hand
        const parasite = player.hand.find((id) => hasFamily(id, "Parasite"));
        if (parasite) {
          game.addLog(`${nexus.name} (R): you may summon a Parasite from hand.`);
        }
      }
    },
  },

  bs01110TheTimelessIceField: {
    onStartOpposingAttackStep(game, nexus, player) {
      const level = getCardLevel(nexus, CARD_POOL[nexus.cardId]);
      const boost = level >= 2 ? 0 : 1000;
      if (boost <= 0) return;
      player.spirits.forEach((s) => { s.bpBoost = (s.bpBoost ?? 0) + boost; });
      game.addLog(`${nexus.name}: all own blocking spirits +${boost} BP.`);
    },
  },
  bs01110TheTimelessIceFieldRevival: {
    onStartOpposingAttackStep(game, nexus, player) {
      player.spirits.forEach((s) => { s.bpBoost = (s.bpBoost ?? 0) + 3000; });
      game.addLog(`${nexus.name} (R): all own spirits +3000 BP (opposing attack step).`);
    },
  },

  bs01113TheInvadedSilverSnow: {
    onStartOpposingAttackStep(game, nexus, player) {
      if (!player.trashCore.normal) return;
      const n = player.trashCore.normal;
      player.trashCore.normal = 0;
      player.reserve.normal += n;
      game.addLog(`${nexus.name}: ${n} cores Trash → Reserve (opposing attack step).`);
    },
  },
  bs01113TheInvadedSilverSnowRevival: {
    onStartOpposingAttackStep(game, nexus, player) {
      let moved = player.trashCore.normal;
      if (player.trashCore.soul) {
        player.trashCore.soul = false;
        player.reserve.soul = true;
        moved += 1;
        // Refresh machine spirits
        player.spirits.filter((s) => hasFamily(s.cardId, "Machine")).forEach((s) => {
          s.exhausted = false;
        });
        game.addLog(`${nexus.name} (R): Soul Core Trash → Reserve; Machine spirits refreshed.`);
      }
      if (player.trashCore.normal > 0) {
        player.reserve.normal += player.trashCore.normal;
        player.trashCore.normal = 0;
        game.addLog(`${nexus.name} (R): ${moved} cores Trash → Reserve.`);
      }
    },
  },
};

// ─────────────────────────────────────────────
// BS01 MAGIC_EFFECTS (Main step)
// ─────────────────────────────────────────────
export const BS01_MAGIC_EFFECTS = {

  bs01117DoubleDraw: {
    getMainTargets() { return []; },
    main(game, player) {
      draw(player, 2);
      game.addLog(`Double Draw: drew 2 cards.`);
    },
  },
  bs01117DoubleDrawRevival: {
    getMainTargets() { return []; },
    main(game, player) {
      draw(player, 2);
      game.addLog(`Double Draw (R): drew 2 cards.`);
    },
  },

  bs01118CallOfLost: {
    getMainTargets(_game, player) {
      return [...new Set(player.trash.filter((id) => CARD_POOL[id]?.type === "spirit"))].map((id) => ({ uid: id, label: CARD_POOL[id]?.name ?? id }));
    },
    main(game, player, targetUid) {
      if (!targetUid) return;
      const idx = player.trash.lastIndexOf(targetUid);
      if (idx >= 0) {
        player.trash.splice(idx, 1);
        player.hand.push(targetUid);
        game.addLog(`Call of Lost: returned ${CARD_POOL[targetUid]?.name} to hand.`);
      }
    },
  },
  bs01118CallOfLostRevival: {
    getMainTargets(_game, player) {
      return [...new Set(player.trash.filter((id) => CARD_POOL[id]?.type === "spirit"))].map((id) => ({ uid: id, label: CARD_POOL[id]?.name ?? id }));
    },
    main(game, player, targetUid) {
      if (!targetUid) return;
      const idx = player.trash.lastIndexOf(targetUid);
      if (idx >= 0) { player.trash.splice(idx, 1); player.hand.push(targetUid); game.addLog(`Call of Lost (R): returned ${CARD_POOL[targetUid]?.name} to hand.`); }
    },
  },

  bs01120BusterPhalanx: {
    getMainTargets() { return []; },
    main(game, player) {
      const opp = game._opp(player);
      [...player.nexuses, ...opp.nexuses].forEach((n) => {
        const owner = player.nexuses.includes(n) ? player : opp;
        const idx = owner.nexuses.indexOf(n);
        if (idx >= 0) { owner.nexuses.splice(idx, 1); owner.reserve.normal += n.cores.normal; if (n.cores.soul) owner.reserve.soul = true; }
        game.addLog(`Buster Phalanx: destroyed ${n.name}.`);
      });
    },
  },
  bs01120BusterPhalanxRevival: {
    getMainTargets() { return []; },
    main(game, player) {
      const opp = game._opp(player);
      [...player.nexuses, ...opp.nexuses].forEach((n) => {
        const owner = player.nexuses.includes(n) ? player : opp;
        const idx = owner.nexuses.indexOf(n);
        if (idx >= 0) { owner.nexuses.splice(idx, 1); owner.reserve.normal += n.cores.normal; if (n.cores.soul) owner.reserve.soul = true; }
        game.addLog(`Buster Phalanx (R): destroyed ${n.name}.`);
      });
    },
  },

  bs01127KillerTelescope: {
    getMainTargets() { return []; },
    main(game, player) {
      player._canAttackExhaustedThisTurn = true;
      game.addLog(`Killer Telescope: spirits can attack exhausted this turn.`);
    },
  },
  bs01127KillerTelescopeRevival: {
    getMainTargets() { return []; },
    main(game, player) {
      player._canAttackExhaustedThisTurn = true;
      game.addLog(`Killer Telescope (R): spirits can attack exhausted this turn.`);
    },
  },

  bs01128ChaosDraw: {
    getMainTargets() { return []; },
    main(game, player) {
      const opp = game._opp(player);
      const count = opp.spirits.filter((s) => s.exhausted).length;
      if (count > 0) { draw(player, count); game.addLog(`Chaos Draw: drew ${count} cards (${count} exhausted opp spirits).`); }
    },
  },
  bs01128ChaosDrawRevival: {
    getMainTargets() { return []; },
    main(game, player) {
      const opp = game._opp(player);
      const exhausted = opp.spirits.filter((s) => s.exhausted);
      const count = exhausted.length;
      if (count > 0) { draw(player, count); game.addLog(`Chaos Draw (R): drew ${count} cards.`); }
    },
  },

  bs01131DarkCoffin: {
    getMainTargets(game, player) {
      return [...game._opp(player).spirits.filter((s) => s.exhausted), ...player.spirits.filter((s) => s.exhausted)]
        .map((s) => ({ uid: s.uid, label: `${s.name} (destroy)` }));
    },
    main(game, player, targetUid) {
      if (!targetUid) return;
      const opp = game._opp(player);
      const s = opp.spirits.find((x) => x.uid === targetUid) ?? player.spirits.find((x) => x.uid === targetUid);
      if (!s) return;
      const owner = opp.spirits.includes(s) ? opp : player;
      game.destroySpirit(owner, s.uid);
      game.addLog(`Dark Coffin: destroyed ${s.name}.`);
    },
  },
  bs01131DarkCoffinRevival: {
    getMainTargets() { return []; },
  },

  bs01132StormDraw: {
    getMainTargets() { return []; },
    main(game, player) {
      draw(player, 3);
      game.addLog(`Storm Draw: drew 3 cards.`);
      if (player.hand.length >= 2) {
        if (player.isAi) {
          const disc = player.hand.splice(0, 2);
          disc.forEach((id) => player.trash.push(id));
          game.addLog(`Storm Draw: AI discarded 2 cards.`);
        } else {
          game.awaitingEffect = {
            type: "returnHandCardToDeckBottom",
            label: `Storm Draw: Discard 2 cards`,
            ownerId: player.id,
            validTargets: player.hand.map((_, i) => String(i)),
            optional: false,
            pendingBattleAttackerUid: null,
          };
        }
      }
    },
  },

  bs01136GatherForces: {
    getMainTargets() { return []; },
    main(game, player) {
      player.reserve.normal += 1;
      game.addLog(`Gather Forces: core Void → Reserve.`);
    },
  },
  bs01136GatherForcesRevival: {
    getMainTargets() { return []; },
    main(game, player) {
      player.reserve.normal += 1;
      game.addLog(`Gather Forces (R): core Void → Reserve.`);
    },
  },

  bs01138HandReverse: {
    getMainTargets() { return []; },
    main(game, player) {
      if (!player.hand.length) { game.addLog(`Hand Reverse: no cards in hand.`); return; }
      const opp = game._opp(player);
      const oppHandSize = opp.hand.length;
      player.hand.forEach((id) => player.trash.push(id));
      player.hand = [];
      game.addLog(`Hand Reverse: discarded entire hand.`);
      if (oppHandSize > 0) {
        draw(player, oppHandSize);
        game.addLog(`Hand Reverse: drew ${oppHandSize} cards.`);
      }
    },
  },
  bs01138HandReverseRevival: {
    getMainTargets() { return []; },
    main(game, player) {
      if (!player.hand.length) { game.addLog(`Hand Reverse (R): no cards in hand.`); return; }
      const opp = game._opp(player);
      const oppHandSize = opp.hand.length;
      player.hand.forEach((id) => player.trash.push(id));
      player.hand = [];
      game.addLog(`Hand Reverse (R): discarded entire hand.`);
      draw(player, oppHandSize + 1);
      game.addLog(`Hand Reverse (R): drew ${oppHandSize + 1} cards.`);
    },
  },
};

// ─────────────────────────────────────────────
// BS01 MAGIC_FLASH_EFFECTS
// ─────────────────────────────────────────────
export const BS01_MAGIC_FLASH_EFFECTS = {

  bs01114BusterSpear: {
    getFlashTargets(game, player) {
      const opp = game._opp(player);
      return [...opp.nexuses, ...player.nexuses].map((n) => ({ uid: n.uid, label: n.name }));
    },
    flash(game, player, targetUid) {
      const opp = game._opp(player);
      let found = opp.nexuses.find((n) => n.uid === targetUid);
      const isOpp = !!found;
      if (!found) found = player.nexuses.find((n) => n.uid === targetUid);
      if (!found) return;
      const owner = isOpp ? opp : player;
      game._destroyNexus(owner, found.uid);
      if (isOpp) { draw(player, 1); game.addLog(`Buster Spear: destroyed opp nexus, drew 1 card.`); }
      else game.addLog(`Buster Spear: destroyed own nexus.`);
    },
  },
  bs01114BusterSpearRevival: {
    getFlashTargets(game, player) {
      const opp = game._opp(player);
      return [...opp.nexuses, ...player.nexuses].map((n) => ({ uid: n.uid, label: n.name }));
    },
    flash(game, player, targetUid) {
      const opp = game._opp(player);
      let found = opp.nexuses.find((n) => n.uid === targetUid);
      const isOpp = !!found;
      if (!found) found = player.nexuses.find((n) => n.uid === targetUid);
      if (!found) return;
      const owner = isOpp ? opp : player;
      game._destroyNexus(owner, found.uid);
      if (isOpp) { draw(player, 2); game.addLog(`Buster Spear (R): destroyed opp nexus, drew 2 cards.`); }
    },
  },

  bs01115Awaken: {
    getFlashTargets(_game, player) {
      return player.spirits.map((s) => ({ uid: s.uid, label: `${s.name} (add cores)` }));
    },
    flash(game, player, targetUid) {
      const s = player.spirits.find((x) => x.uid === targetUid);
      if (!s) return;
      const n = Math.min(3, player.reserve.normal);
      player.reserve.normal -= n;
      s.cores.normal += n;
      draw(player, 1);
      game.addLog(`Awaken: sent ${n} cores to ${s.name}, drew 1 card.`);
    },
  },
  bs01115AwakenRevival: {
    getFlashTargets(_game, player) {
      return player.spirits.map((s) => ({ uid: s.uid, label: `${s.name} (add cores)` }));
    },
    flash(game, player, targetUid) {
      const s = player.spirits.find((x) => x.uid === targetUid);
      if (!s) return;
      const n = Math.min(3, player.reserve.normal);
      player.reserve.normal -= n;
      s.cores.normal += n;
      draw(player, 1);
      if (s.cores.soul) { s.bpBoost = (s.bpBoost ?? 0) + 5000; game.addLog(`Awaken (R): +5000 BP to ${s.name} (Soul Core moved).`); }
      game.addLog(`Awaken (R): sent ${n} cores to ${s.name}, drew 1 card.`);
    },
  },

  bs01116OffensiveAura: {
    getFlashTargets() { return []; },
    flash(game, player) {
      player.spirits.forEach((s) => { s.bpBoost = (s.bpBoost ?? 0) + 2000; });
      game.addLog(`Offensive Aura: all own attacking spirits +2000 BP.`);
    },
  },
  bs01116OffensiveAuraRevival: {
    getFlashTargets() { return []; },
    flash(game, player) {
      player.spirits.forEach((s) => { s.bpBoost = (s.bpBoost ?? 0) + 5000; });
      game.addLog(`Offensive Aura (R): all own spirits +5000 BP.`);
    },
  },

  bs01117DoubleDraw: {
    getFlashTargets(_game, player) {
      return player.spirits.map((s) => ({ uid: s.uid, label: `${s.name} (+2000 BP)` }));
    },
    flash(game, player, targetUid) {
      const s = player.spirits.find((x) => x.uid === targetUid);
      if (s) { s.bpBoost = (s.bpBoost ?? 0) + 2000; game.addLog(`Double Draw: ${s.name} +2000 BP.`); }
    },
  },
  bs01117DoubleDrawRevival: {
    getFlashTargets(_game, player) {
      return player.spirits.map((s) => ({ uid: s.uid, label: `${s.name} (+2000 BP)` }));
    },
    flash(game, player, targetUid) {
      const s = player.spirits.find((x) => x.uid === targetUid);
      if (s) { s.bpBoost = (s.bpBoost ?? 0) + 2000; game.addLog(`Double Draw (R): ${s.name} +2000 BP.`); }
    },
  },

  bs01118CallOfLost: {
    getFlashTargets(_game, player) {
      return player.spirits.map((s) => ({ uid: s.uid, label: `${s.name} (+2000 BP)` }));
    },
    flash(game, player, targetUid) {
      const s = player.spirits.find((x) => x.uid === targetUid);
      if (s) { s.bpBoost = (s.bpBoost ?? 0) + 2000; game.addLog(`Call of Lost: ${s.name} +2000 BP.`); }
    },
  },
  bs01118CallOfLostRevival: {
    getFlashTargets(_game, player) {
      return player.spirits.map((s) => ({ uid: s.uid, label: `${s.name} (+2000 BP)` }));
    },
    flash(game, player, targetUid) {
      const s = player.spirits.find((x) => x.uid === targetUid);
      if (s) { s.bpBoost = (s.bpBoost ?? 0) + 2000; game.addLog(`Call of Lost (R): ${s.name} +2000 BP.`); }
    },
  },

  bs01120BusterPhalanx: {
    getFlashTargets(_game, player) {
      return player.spirits.map((s) => ({ uid: s.uid, label: `${s.name} (+4000 BP)` }));
    },
    flash(game, player, targetUid) {
      const s = player.spirits.find((x) => x.uid === targetUid);
      if (s) { s.bpBoost = (s.bpBoost ?? 0) + 4000; game.addLog(`Buster Phalanx: ${s.name} +4000 BP.`); }
    },
  },
  bs01120BusterPhalanxRevival: {
    getFlashTargets(game, player) {
      return player.spirits.map((s) => ({ uid: s.uid, label: `${s.name} (+4000 BP)` }));
    },
    flash(game, player, targetUid) {
      const s = player.spirits.find((x) => x.uid === targetUid);
      if (s) { s.bpBoost = (s.bpBoost ?? 0) + 4000; game.addLog(`Buster Phalanx (R): ${s.name} +4000 BP.`); }
    },
  },

  bs01121FlameDance: {
    getFlashTargets(game, player) {
      return game._opp(player).spirits
        .filter((s) => getEffectiveBP(s, CARD_POOL[s.cardId]) <= 4000 && !s._magicImmune)
        .map((s) => ({ uid: s.uid, label: `${s.name} (destroy)` }));
    },
    flash(game, player, targetUid) {
      const opp = game._opp(player);
      const s = opp.spirits.find((x) => x.uid === targetUid);
      if (s) { game.destroySpirit(opp, s.uid); game.addLog(`Flame Dance: destroyed ${s.name}.`); }
    },
  },
  bs01121FlameDanceRevival: {
    getFlashTargets(game, player) {
      const limit = player.spirits.some((s) => s.cores.soul) ? 10000 : 4000;
      return game._opp(player).spirits
        .filter((s) => getEffectiveBP(s, CARD_POOL[s.cardId]) <= limit && !s._magicImmune)
        .map((s) => ({ uid: s.uid, label: `${s.name} (destroy)` }));
    },
    flash(game, player, targetUid) {
      const opp = game._opp(player);
      const s = opp.spirits.find((x) => x.uid === targetUid);
      if (s) { game.destroySpirit(opp, s.uid); game.addLog(`Flame Dance (R): destroyed ${s.name}.`); }
    },
  },

  bs01122FlameTempest: {
    getFlashTargets() { return []; },
    flash(game, player) {
      const opp = game._opp(player);
      const toDestroy = opp.spirits.filter((s) => getEffectiveBP(s, CARD_POOL[s.cardId]) <= 3000 && !s._magicImmune);
      toDestroy.forEach((s) => { game.destroySpirit(opp, s.uid); game.addLog(`Flame Tempest: destroyed ${s.name}.`); });
      const ownDestroy = player.spirits.filter((s) => getEffectiveBP(s, CARD_POOL[s.cardId]) <= 3000 && !s._magicImmune);
      ownDestroy.forEach((s) => { game.destroySpirit(player, s.uid); game.addLog(`Flame Tempest: destroyed own ${s.name}.`); });
    },
  },
  bs01122FlameTempestRevival: {
    getFlashTargets() { return []; },
    flash(game, player) {
      const limit = player.spirits.some((s) => s.cores.soul) ? 7000 : 3000;
      const opp = game._opp(player);
      opp.spirits.filter((s) => getEffectiveBP(s, CARD_POOL[s.cardId]) <= limit && !s._magicImmune)
        .forEach((s) => { game.destroySpirit(opp, s.uid); game.addLog(`Flame Tempest (R): destroyed ${s.name}.`); });
    },
  },

  bs01125DeadlyBalance: {
    getFlashTargets(game, player) {
      // Target own spirit to destroy (opponent must also destroy one)
      return player.spirits.map((s) => ({ uid: s.uid, label: `${s.name} (destroy self)` }));
    },
    flash(game, player, targetUid) {
      // Destroy own spirit
      const own = player.spirits.find((s) => s.uid === targetUid);
      if (own) { game._destroyOwnSpirit(player, own.uid); game.addLog(`Deadly Balance: destroyed own ${own.name}.`); }
      // AI/opponent also destroys one spirit
      const opp = game._opp(player);
      if (opp.spirits.length) {
        const oppTarget = opp.isAi
          ? opp.spirits[0]
          : [...opp.spirits].sort((a, b) => getEffectiveBP(a, CARD_POOL[a.cardId]) - getEffectiveBP(b, CARD_POOL[b.cardId]))[0];
        game.destroySpirit(opp, oppTarget.uid);
        game.addLog(`Deadly Balance: opponent destroyed ${oppTarget.name}.`);
      }
    },
  },
  bs01125DeadlyBalanceRevival: {
    getFlashTargets(_game, player) {
      return player.spirits.map((s) => ({ uid: s.uid, label: `${s.name} (destroy self)` }));
    },
    flash(game, player, targetUid) {
      const own = player.spirits.find((s) => s.uid === targetUid);
      if (own) { game._destroyOwnSpirit(player, own.uid); game.addLog(`Deadly Balance (R): destroyed own ${own.name}.`); }
      const opp = game._opp(player);
      if (opp.spirits.length) {
        const oppTarget = [...opp.spirits].sort((a, b) => getEffectiveBP(a, CARD_POOL[a.cardId]) - getEffectiveBP(b, CARD_POOL[b.cardId]))[0];
        game.destroySpirit(opp, oppTarget.uid);
        game.addLog(`Deadly Balance (R): opponent destroyed ${oppTarget.name}.`);
      }
    },
  },

  bs01126ShadowElixir: {
    getFlashTargets() { return []; },
    flash(game, player) {
      if (player.reserve.normal > 0) {
        player.reserve.normal -= 1;
        player.life += 1;
        game.addLog(`Shadow Elixir: core Reserve → Life. Life now ${player.life}.`);
      }
    },
  },
  bs01126ShadowElixirRevival: {
    getFlashTargets() { return []; },
    flash(game, player) {
      if (player.reserve.normal > 0) {
        player.reserve.normal -= 1;
        player.life += 1;
        game.addLog(`Shadow Elixir (R): core Reserve → Life (${player.life}).`);
      }
      if (player.spirits.some((s) => s.cores.soul)) {
        draw(player, 1);
        game.addLog(`Shadow Elixir (R): drew 1 card (Soul Core on field).`);
      }
    },
  },

  bs01127KillerTelescope: {
    getFlashTargets(_game, player) {
      return player.spirits.map((s) => ({ uid: s.uid, label: `${s.name} (+2000 BP)` }));
    },
    flash(game, player, targetUid) {
      const s = player.spirits.find((x) => x.uid === targetUid);
      if (s) { s.bpBoost = (s.bpBoost ?? 0) + 2000; game.addLog(`Killer Telescope: ${s.name} +2000 BP.`); }
    },
  },
  bs01127KillerTelescopeRevival: {
    getFlashTargets(_game, player) {
      return player.spirits.map((s) => ({ uid: s.uid, label: `${s.name} (+2000 BP)` }));
    },
    flash(game, player, targetUid) {
      const s = player.spirits.find((x) => x.uid === targetUid);
      if (s) { s.bpBoost = (s.bpBoost ?? 0) + 2000; game.addLog(`Killer Telescope (R): ${s.name} +2000 BP.`); }
    },
  },

  bs01128ChaosDraw: {
    getFlashTargets(_game, player) {
      return player.spirits.map((s) => ({ uid: s.uid, label: `${s.name} (+3000 BP)` }));
    },
    flash(game, player, targetUid) {
      const s = player.spirits.find((x) => x.uid === targetUid);
      if (s) { s.bpBoost = (s.bpBoost ?? 0) + 3000; game.addLog(`Chaos Draw: ${s.name} +3000 BP.`); }
    },
  },
  bs01128ChaosDrawRevival: {
    getFlashTargets(_game, player) {
      return player.spirits.map((s) => ({ uid: s.uid, label: `${s.name} (+3000 BP)` }));
    },
    flash(game, player, targetUid) {
      const s = player.spirits.find((x) => x.uid === targetUid);
      if (s) { s.bpBoost = (s.bpBoost ?? 0) + 3000; game.addLog(`Chaos Draw (R): ${s.name} +3000 BP.`); }
    },
  },

  bs01129PoisonShoot: {
    getFlashTargets(game, player) {
      return [...game._opp(player).spirits, ...player.spirits]
        .filter((s) => s.cores.normal > 0)
        .map((s) => ({ uid: s.uid, label: `${s.name} (send 1 core)` }));
    },
    flash(game, player, targetUid) {
      const opp = game._opp(player);
      const s = opp.spirits.find((x) => x.uid === targetUid) ?? player.spirits.find((x) => x.uid === targetUid);
      if (!s) return;
      const owner = opp.spirits.includes(s) ? opp : player;
      game._sendCores(owner, s.uid, 1);
      game.addLog(`Poison Shoot: sent 1 core from ${s.name}.`);
    },
  },
  bs01129PoisonShootRevival: {
    getFlashTargets(game, player) {
      return [...game._opp(player).spirits, ...player.spirits]
        .filter((s) => s.cores.normal > 0)
        .map((s) => ({ uid: s.uid, label: `${s.name} (send 1 core)` }));
    },
    flash(game, player, targetUid) {
      const opp = game._opp(player);
      const s = opp.spirits.find((x) => x.uid === targetUid) ?? player.spirits.find((x) => x.uid === targetUid);
      if (!s) return;
      const owner = opp.spirits.includes(s) ? opp : player;
      const n = Math.min(3, s.cores.normal);
      game._sendCores(owner, s.uid, n);
      game.addLog(`Poison Shoot (R): sent ${n} cores from ${s.name}.`);
    },
  },

  bs01131DarkCoffin: {
    getFlashTargets(_game, player) {
      return player.spirits.map((s) => ({ uid: s.uid, label: `${s.name} (+4000 BP)` }));
    },
    flash(game, player, targetUid) {
      const s = player.spirits.find((x) => x.uid === targetUid);
      if (s) { s.bpBoost = (s.bpBoost ?? 0) + 4000; game.addLog(`Dark Coffin: ${s.name} +4000 BP.`); }
    },
  },
  bs01131DarkCoffinRevival: {
    getFlashTargets(game, player) {
      return game._opp(player).spirits.filter((s) => s.exhausted && !s._magicImmune)
        .map((s) => ({ uid: s.uid, label: `${s.name} (destroy)` }));
    },
    flash(game, player, targetUid) {
      const opp = game._opp(player);
      const s = opp.spirits.find((x) => x.uid === targetUid);
      if (s) { game.destroySpirit(opp, s.uid); game.addLog(`Dark Coffin (R): destroyed ${s.name}.`); }
    },
  },

  bs01133WildPower: {
    getFlashTargets(_game, player) {
      return player.spirits.map((s) => ({ uid: s.uid, label: `${s.name} (+2000 BP)` }));
    },
    flash(game, player, targetUid) {
      const s = player.spirits.find((x) => x.uid === targetUid);
      if (s) { s.bpBoost = (s.bpBoost ?? 0) + 2000; game.addLog(`Wild Power: ${s.name} +2000 BP.`); }
    },
  },
  bs01133WildPowerRevival: {
    getFlashTargets(_game, player) {
      return player.spirits.map((s) => ({ uid: s.uid, label: `${s.name} (+2000 BP)` }));
    },
    flash(game, player, targetUid) {
      const s = player.spirits.find((x) => x.uid === targetUid);
      if (!s) return;
      const boost = player.reserve.soul ? 5000 : 2000;
      s.bpBoost = (s.bpBoost ?? 0) + boost;
      game.addLog(`Wild Power (R): ${s.name} +${boost} BP.`);
    },
  },

  bs01134BindingThorn: {
    getFlashTargets(game, player) {
      return game._opp(player).spirits.filter((s) => !s.exhausted && !s._magicImmune)
        .map((s) => ({ uid: s.uid, label: `${s.name} (exhaust)` }));
    },
    flash(game, player, targetUid) {
      const opp = game._opp(player);
      const s = opp.spirits.find((x) => x.uid === targetUid);
      if (s) { s.exhausted = true; game.addLog(`Binding Thorn: exhausted ${s.name}.`); }
    },
  },
  bs01134BindingThornRevival: {
    getFlashTargets(game, player) {
      return game._opp(player).spirits.filter((s) => !s.exhausted && !s._magicImmune)
        .map((s) => ({ uid: s.uid, label: `${s.name} (exhaust)` }));
    },
    flash(game, player, targetUid) {
      const opp = game._opp(player);
      const s = opp.spirits.find((x) => x.uid === targetUid);
      if (s) { s.exhausted = true; game.addLog(`Binding Thorn (R): exhausted ${s.name}.`); }
      if (player.reserve.soul) {
        const own = player.spirits.find((x) => !x._boosted);
        if (own) { own.bpBoost = (own.bpBoost ?? 0) + 3000; own._boosted = true; game.addLog(`Binding Thorn (R): ${own.name} +3000 BP (Soul Core in Reserve).`); }
      }
    },
  },

  bs01135PowerAura: {
    getFlashTargets() { return []; },
    flash(game, player) {
      draw(player, 1);
      player.spirits.forEach((s) => { s.bpBoost = (s.bpBoost ?? 0) + 1000; });
      game.addLog(`Power Aura: drew 1 card, all own spirits +1000 BP.`);
    },
  },
  bs01135PowerAuraRevival: {
    getFlashTargets() { return []; },
    flash(game, player) {
      draw(player, 1);
      player.spirits.forEach((s) => { s.bpBoost = (s.bpBoost ?? 0) + 3000; });
      game.addLog(`Power Aura (R): drew 1 card, all own spirits +3000 BP.`);
    },
  },

  bs01136GatherForces: {
    getFlashTargets(_game, player) {
      return player.spirits.map((s) => ({ uid: s.uid, label: `${s.name} (+1000 BP)` }));
    },
    flash(game, player, targetUid) {
      const s = player.spirits.find((x) => x.uid === targetUid);
      if (s) { s.bpBoost = (s.bpBoost ?? 0) + 1000; game.addLog(`Gather Forces: ${s.name} +1000 BP.`); }
    },
  },
  bs01136GatherForcesRevival: {
    getFlashTargets(_game, player) {
      return player.spirits.map((s) => ({ uid: s.uid, label: `${s.name} (+1000 BP)` }));
    },
    flash(game, player, targetUid) {
      const s = player.spirits.find((x) => x.uid === targetUid);
      if (s) { s.bpBoost = (s.bpBoost ?? 0) + 1000; game.addLog(`Gather Forces (R): ${s.name} +1000 BP.`); }
    },
  },

  bs01137RelationSoul: {
    getFlashTargets(_game, player) {
      return player.spirits.map((s) => ({ uid: s.uid, label: `${s.name} (+BP per exhausted opp)` }));
    },
    flash(game, player, targetUid) {
      const s = player.spirits.find((x) => x.uid === targetUid);
      if (!s) return;
      const count = game._opp(player).spirits.filter((x) => x.exhausted).length;
      s.bpBoost = (s.bpBoost ?? 0) + count * 1000;
      game.addLog(`Relation Soul: ${s.name} +${count * 1000} BP (${count} exhausted opp).`);
    },
  },
  bs01137RelationSoulRevival: {
    getFlashTargets(_game, player) {
      return player.spirits.map((s) => ({ uid: s.uid, label: `${s.name} (+BP per exhausted opp)` }));
    },
    flash(game, player, targetUid) {
      const s = player.spirits.find((x) => x.uid === targetUid);
      if (!s) return;
      const count = game._opp(player).spirits.filter((x) => x.exhausted).length;
      s.bpBoost = (s.bpBoost ?? 0) + count * 5000;
      game.addLog(`Relation Soul (R): ${s.name} +${count * 5000} BP.`);
    },
  },

  bs01138HandReverse: {
    getFlashTargets(_game, player) {
      return player.spirits.map((s) => ({ uid: s.uid, label: `${s.name} (+3000 BP)` }));
    },
    flash(game, player, targetUid) {
      const s = player.spirits.find((x) => x.uid === targetUid);
      if (s) { s.bpBoost = (s.bpBoost ?? 0) + 3000; game.addLog(`Hand Reverse: ${s.name} +3000 BP.`); }
    },
  },
  bs01138HandReverseRevival: {
    getFlashTargets(_game, player) {
      return player.spirits.map((s) => ({ uid: s.uid, label: `${s.name} (+3000 BP)` }));
    },
    flash(game, player, targetUid) {
      const s = player.spirits.find((x) => x.uid === targetUid);
      if (s) { s.bpBoost = (s.bpBoost ?? 0) + 3000; game.addLog(`Hand Reverse (R): ${s.name} +3000 BP.`); }
    },
  },

  bs01141InvisibleCloak: {
    getFlashTargets(_game, player) {
      return player.spirits.map((s) => ({ uid: s.uid, label: `${s.name} (can't be blocked)` }));
    },
    flash(game, player, targetUid) {
      const s = player.spirits.find((x) => x.uid === targetUid);
      if (s) { s._cantBeBlockedCostLimit = 999; game.addLog(`Invisible Cloak: ${s.name} can't be blocked this turn.`); }
    },
  },
  bs01141InvisibleCloakRevival: {
    getFlashTargets(_game, player) {
      return player.spirits.map((s) => ({ uid: s.uid, label: `${s.name} (can't be blocked)` }));
    },
    flash(game, player, targetUid) {
      const s = player.spirits.find((x) => x.uid === targetUid);
      if (s) { s._cantBeBlockedCostLimit = 999; game.addLog(`Invisible Cloak (R): ${s.name} can't be blocked this turn.`); }
    },
  },

  bs01142PureElixir: {
    getFlashTargets() { return []; },
    flash(game, player) {
      player.spirits.forEach((s) => {
        if (s.exhausted) { s.exhausted = false; s._cantAttackThisTurn = true; }
      });
      game.addLog(`Pure Elixir: refreshed all own exhausted spirits (can't attack this turn).`);
    },
  },
  bs01142PureElixirRevival: {
    getFlashTargets() { return []; },
    flash(game, player) {
      player.spirits.forEach((s) => {
        if (s.exhausted) { s.exhausted = false; s._cantAttackThisTurn = true; }
      });
      game.addLog(`Pure Elixir (R): refreshed all own exhausted spirits (can't attack this turn).`);
    },
  },

  bs01144SilentWall: {
    getFlashTargets() { return []; },
    flash(game, player) {
      player._silentWallActive = true;
      game.addLog(`Silent Wall: attack phase ends after this battle.`);
    },
  },
  bs01144SilentWallRevival: {
    getFlashTargets() { return []; },
    flash(game, player) {
      player._silentWallActive = true;
      game.addLog(`Silent Wall (R): attack step ends after this battle.`);
    },
  },

  bs01145DefensiveAura: {
    getFlashTargets() { return []; },
    flash(game, player) {
      player.spirits.forEach((s) => { s.bpBoost = (s.bpBoost ?? 0) + 3000; });
      game.addLog(`Defensive Aura: all own blocking spirits +3000 BP.`);
    },
  },
  bs01145DefensiveAuraRevival: {
    getFlashTargets() { return []; },
    flash(game, player) {
      player.spirits.forEach((s) => { s.bpBoost = (s.bpBoost ?? 0) + 6000; });
      game.addLog(`Defensive Aura (R): all own spirits +6000 BP.`);
    },
  },

  bs01146DreamRibbon: {
    getFlashTargets(game, player) {
      return game._opp(player).spirits.filter((s) => !s._magicImmune)
        .map((s) => ({ uid: s.uid, label: `${s.name} (return to hand)` }));
    },
    flash(game, player, targetUid) {
      const opp = game._opp(player);
      if (targetUid) { game._returnToHand(opp, targetUid); game.addLog(`Dream Ribbon: returned spirit to hand.`); }
    },
  },
  bs01146DreamRibbonRevival: {
    getFlashTargets(game, player) {
      return game._opp(player).spirits.filter((s) => !s._magicImmune)
        .map((s) => ({ uid: s.uid, label: `${s.name} (return to hand)` }));
    },
    flash(game, player, targetUid) {
      const opp = game._opp(player);
      if (targetUid) {
        game._returnToHand(opp, targetUid);
        game.addLog(`Dream Ribbon (R): returned spirit to hand.`);
        if (player.spirits.some((s) => s.cores.soul)) {
          const tgt2 = opp.spirits.find((s) => getEffectiveBP(s, CARD_POOL[s.cardId]) <= 5000 && !s._magicImmune);
          if (tgt2) { game._returnToHand(opp, tgt2.uid); game.addLog(`Dream Ribbon (R): also returned ${tgt2.name} (Soul Core, ≤5000 BP).`); }
        }
      }
    },
  },

  bs01147DreamChest: {
    getFlashTargets(game, player) {
      const opp = game._opp(player);
      return [...opp.spirits, ...player.spirits]
        .map((s) => ({ uid: s.uid, label: `${s.name} (return to decktop)` }));
    },
    flash(game, player, targetUid) {
      const opp = game._opp(player);
      const s = opp.spirits.find((x) => x.uid === targetUid) ?? player.spirits.find((x) => x.uid === targetUid);
      if (!s) return;
      const owner = opp.spirits.includes(s) ? opp : player;
      const idx = owner.spirits.findIndex((x) => x.uid === s.uid);
      if (idx >= 0) {
        owner.spirits.splice(idx, 1);
        owner.reserve.normal += s.cores.normal;
        if (s.cores.soul) owner.reserve.soul = true;
        owner.deck.unshift(s.cardId);
        game.addLog(`Dream Chest: returned ${s.name} to decktop.`);
      }
    },
  },
  bs01147DreamChestRevival: {
    getFlashTargets(game, player) {
      const opp = game._opp(player);
      return [...opp.spirits, ...player.spirits]
        .map((s) => ({ uid: s.uid, label: `${s.name} (return to decktop)` }));
    },
    flash(game, player, targetUid) {
      const opp = game._opp(player);
      const s = opp.spirits.find((x) => x.uid === targetUid) ?? player.spirits.find((x) => x.uid === targetUid);
      if (!s) return;
      const owner = opp.spirits.includes(s) ? opp : player;
      const idx = owner.spirits.findIndex((x) => x.uid === s.uid);
      if (idx >= 0) {
        owner.spirits.splice(idx, 1);
        owner.reserve.normal += s.cores.normal;
        if (s.cores.soul) owner.reserve.soul = true;
        owner.deck.unshift(s.cardId);
        game.addLog(`Dream Chest (R): returned ${s.name} to decktop.`);
      }
    },
  },

  bs01148LeakDrive: {
    getFlashTargets() { return []; },
    flash(game, player) {
      if (game.awaitingFlash) game.awaitingFlash._endBattle = true;
      player._leakDriveActive = true;
      game.addLog(`Leak Drive: battle ended immediately.`);
    },
  },
  bs01148LeakDriveRevival: {
    getFlashTargets() { return []; },
    flash(game, player) {
      if (game.awaitingFlash) game.awaitingFlash._endBattle = true;
      player._leakDriveActive = true;
      game.addLog(`Leak Drive (R): battle ended.`);
      if (player.spirits.some((s) => s.cores.soul)) {
        const opp = game._opp(player);
        const t = opp.spirits[0];
        if (t) { game._returnToHand(opp, t.uid); game.addLog(`Leak Drive (R): returned ${t.name} to hand (Soul Core).`); }
      }
    },
  },

  bs01149AttackShift: {
    getFlashTargets(_game, player) {
      return player.spirits.map((s) => ({ uid: s.uid, label: `${s.name} (+3000 BP)` }));
    },
    flash(game, player, targetUid) {
      const s = player.spirits.find((x) => x.uid === targetUid);
      if (s) { s.bpBoost = (s.bpBoost ?? 0) + 3000; game.addLog(`Attack Shift: ${s.name} +3000 BP.`); }
    },
  },
  bs01149AttackShiftRevival: {
    getFlashTargets(_game, player) {
      return player.spirits.map((s) => ({ uid: s.uid, label: `${s.name} (+10000 BP)` }));
    },
    flash(game, player, targetUid) {
      const s = player.spirits.find((x) => x.uid === targetUid);
      if (s) { s.bpBoost = (s.bpBoost ?? 0) + 10000; game.addLog(`Attack Shift (R): ${s.name} +10000 BP.`); }
    },
  },
};

// ─────────────────────────────────────────────
// BS01 INVOKE_FLASH_HANDLERS (Flash – Awaken)
// ─────────────────────────────────────────────
function awakenInvoke(game, spirit, player) {
  spirit.flashUsedThisBattle = true;
  if (player.isAi) {
    let moved = 0;
    for (const s of player.spirits) {
      if (s.uid === spirit.uid) continue;
      const n = s.cores.normal;
      if (n > 0) { s.cores.normal = 0; spirit.cores.normal += n; moved += n; }
    }
    if (moved) game.addLog(`${spirit.name}: Awaken – moved ${moved} cores to self.`);
  } else {
    // Simplified: move 1 core from the highest-core spirit
    const others = player.spirits.filter((s) => s.uid !== spirit.uid && s.cores.normal > 0);
    if (others.length) {
      const src = [...others].sort((a, b) => b.cores.normal - a.cores.normal)[0];
      src.cores.normal -= 1;
      spirit.cores.normal += 1;
      game.addLog(`${spirit.name}: Awaken – moved 1 core from ${src.name}.`);
    } else {
      game.addLog(`${spirit.name}: Awaken – no cores to move.`);
    }
  }
}

function canAwaken(spirit, player) {
  return !spirit.flashUsedThisBattle && player.spirits.some((s) => s.uid !== spirit.uid && s.cores.normal > 0);
}

export const BS01_INVOKE_FLASH_HANDLERS = {
  bs01013Taurusknight: {
    canInvoke: canAwaken,
    invoke: awakenInvoke,
  },
  bs01013TaurusknightRevival: {
    canInvoke: canAwaken,
    invoke: awakenInvoke,
  },
  bs01020TheBladeDragonSteelanodon: {
    canInvoke: canAwaken,
    invoke: awakenInvoke,
  },
  bs01020TheBladeDragonSteelanodonRevival: {
    canInvoke: canAwaken,
    invoke: awakenInvoke,
  },
  bs01X01TheDragonEmperorSiegfried: {
    canInvoke: canAwaken,
    invoke: awakenInvoke,
  },
  bs01X01TheDragonEmperorSiegfriedRevival: {
    canInvoke: canAwaken,
    invoke: awakenInvoke,
  },
};
