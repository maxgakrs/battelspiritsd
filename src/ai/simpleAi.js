import { CARD_POOL, PHASES, getEffectiveBP } from "../engine/game.js";

export class SimpleAi {
  _getUsableCores(state, player) {
    const currentReserve = player.reserve.normal + (player.reserve.soul ? 1 : 0);
    let usableSpiritsCores = 0;
    for (const s of player.spirits) {
      const card = CARD_POOL[s.cardId];
      const sLv1Min = card?.levels?.[0]?.cores ?? 1;
      const sTotal = s.cores.normal + (s.cores.soul ? 1 : 0);
      usableSpiritsCores += Math.max(0, sTotal - sLv1Min);
    }
    let usableNexusesCores = 0;
    for (const n of player.nexuses) {
      usableNexusesCores += n.cores.normal + (n.cores.soul ? 1 : 0);
    }
    return currentReserve + usableSpiritsCores + usableNexusesCores;
  }

  _prepareReserve(game, needed) {
    const state = game.getState();
    const player = state.players[state.currentPlayer];
    
    let currentReserve = player.reserve.normal + (player.reserve.soul ? 1 : 0);
    let remaining = needed - currentReserve;
    if (remaining <= 0) return true;
    
    // First, try to pull normal cores from spirits' surplus
    for (const s of player.spirits) {
      if (remaining <= 0) break;
      const card = CARD_POOL[s.cardId];
      const sLv1Min = card?.levels?.[0]?.cores ?? 1;
      
      while (remaining > 0 && s.cores.normal > 0) {
        const sTotal = s.cores.normal + (s.cores.soul ? 1 : 0);
        if (sTotal <= sLv1Min) break;
        
        game.moveCore("spirit", s.uid, "reserve", null, false);
        remaining -= 1;
      }
    }
    
    // Next, try to pull Soul Core from spirits' surplus
    for (const s of player.spirits) {
      if (remaining <= 0) break;
      const card = CARD_POOL[s.cardId];
      const sLv1Min = card?.levels?.[0]?.cores ?? 1;
      
      if (s.cores.soul) {
        const sTotal = s.cores.normal + 1;
        if (sTotal > sLv1Min) {
          game.moveCore("spirit", s.uid, "reserve", null, true);
          remaining -= 1;
        }
      }
    }
    
    // Next, try to pull from nexuses
    for (const n of player.nexuses) {
      if (remaining <= 0) break;
      
      while (remaining > 0 && n.cores.normal > 0) {
        game.moveCore("nexus", n.uid, "reserve", null, false);
        remaining -= 1;
      }
      
      if (remaining > 0 && n.cores.soul) {
        game.moveCore("nexus", n.uid, "reserve", null, true);
        remaining -= 1;
      }
    }
    
    return remaining <= 0;
  }

  choosePlayMagic(game) {
    const state = game.getState();
    const player = state.players[state.currentPlayer];
    if (!player.isAi) return null;
    
    const usableCores = this._getUsableCores(state, player);
    
    const candidates = player.hand
      .map((cardId, index) => {
        const card = CARD_POOL[cardId];
        if (!card || card.type !== "magic") return null;
        const verdict = game.canPlayMagic(index);
        if (!verdict.ok) return null;
        
        const needed = verdict.actualCost;
        if (usableCores < needed) return null;
        
        return { card, index, needed };
      })
      .filter(Boolean);
      
    if (candidates.length > 0) {
      const best = candidates[0];
      this._prepareReserve(game, best.needed);
      return best.index;
    }
    return null;
  }

  chooseDeploy(game) {
    const state = game.getState();
    const player = state.players[state.currentPlayer];
    if (!player.isAi) return null;
    
    const usableCores = this._getUsableCores(state, player);
    
    const candidates = player.hand
      .map((cardId, index) => {
        const card = CARD_POOL[cardId];
        if (!card || card.type !== "nexus") return null;
        const verdict = game.canDeploy(index);
        if (!verdict.ok) return null;
        
        const needed = verdict.actualCost;
        if (usableCores < needed) return null;
        
        return { card, index, needed };
      })
      .filter(Boolean);
      
    if (candidates.length > 0) {
      const best = candidates[0];
      this._prepareReserve(game, best.needed);
      return best.index;
    }
    return null;
  }

  chooseSummon(game) {
    const state = game.getState();
    const player = state.players[state.currentPlayer];
    if (!player.isAi) return null;
    
    const usableCores = this._getUsableCores(state, player);
    
    const candidates = player.hand
      .map((cardId, index) => {
        const card = CARD_POOL[cardId];
        if (!card || card.type !== "spirit") return null;
        const verdict = game.canSummon(index);
        if (!verdict.ok) return null;
        
        const lv1Min = card.levels?.[0]?.cores ?? 1;
        const needed = verdict.actualCost + lv1Min;
        if (usableCores < needed) return null;
        
        return { card, index, needed };
      })
      .filter(Boolean)
      .sort((a, b) => (b.card.bp - a.card.bp) || (a.card.cost - b.card.cost));
      
    if (candidates.length > 0) {
      const best = candidates[0];
      this._prepareReserve(game, best.needed);
      return best.index;
    }
    return null;
  }

  chooseAttackers(game) {
    const state = game.getState();
    const player = state.players[state.currentPlayer];
    if (!player.isAi || state.phase !== PHASES.ATTACK) return [];

    const opp = state.players[state.currentPlayer === 0 ? 1 : 0];
    const available = player.spirits.filter((s) => !s.exhausted);
    if (available.length === 0) return [];

    const oppBlockers = opp.spirits.filter((s) => !s.exhausted);
    const ebp = (s) => getEffectiveBP(s, CARD_POOL[s.cardId]);

    // 1. LETHAL CHECK: assume opp blocks our highest-BP spirits;
    //    remaining (N - B) spirits hit unblocked. If guaranteed damage >= opp.life, go all-in.
    const byBPDesc = [...available].sort((a, b) => ebp(b) - ebp(a));
    const unblockedSpirits = byBPDesc.slice(oppBlockers.length);
    const guaranteedDamage = unblockedSpirits.reduce((n, s) => n + (s.symbols ?? 1), 0);

    if (guaranteedDamage >= opp.life) {
      return available.map((s) => s.uid);
    }

    // 2. DEFENSIVE CHECK: if we attack with all, we'll be exhausted next opponent turn.
    //    If opp can deal >= our life unblocked, keep strong blockers back.
    const oppDamage = oppBlockers.reduce((n, s) => n + (s.symbols ?? 1), 0);

    if (player.life <= 2 && oppDamage >= player.life) {
      const keepCount = Math.min(oppBlockers.length, Math.ceil(available.length / 2));
      const keepers = new Set(
        byBPDesc.slice(0, keepCount).map((s) => s.uid),
      );
      const attackers = available.filter((s) => !keepers.has(s.uid));
      if (attackers.length > 0) return attackers.map((s) => s.uid);
      return [];
    }

    // 3. MODERATE LIFE CHECK: if life is 3 and opp can deal 3+ damage, keep one strong blocker.
    if (player.life === 3 && oppBlockers.length > 0 && available.length > 1 && oppDamage >= 3) {
      const strongest = byBPDesc[0];
      const attackers = available.filter((s) => s.uid !== strongest.uid);
      if (attackers.length > 0) return attackers.map((s) => s.uid);
    }

    // 4. DEFAULT: full attack for maximum pressure
    return available.map((s) => s.uid);
  }

  chooseBlock(state, attackerUid) {
    const attackerOwner = state.currentPlayer;
    const defender = state.players[attackerOwner === 0 ? 1 : 0];
    const attacker = state.players[attackerOwner].spirits.find((s) => s.uid === attackerUid);

    if (!attacker) return null;

    const blockers = defender.spirits.filter((s) => !s.exhausted);
    if (blockers.length === 0) return null;

    const atkBP = getEffectiveBP(attacker, CARD_POOL[attacker.cardId]);
    const attSymbols = attacker.symbols ?? 1;
    const ebp = (s) => getEffectiveBP(s, CARD_POOL[s.cardId]);

    // Block with smallest winning blocker to preserve larger spirits for offense.
    const winningBlock = blockers
      .filter((b) => ebp(b) >= atkBP)
      .sort((a, b) => ebp(a) - ebp(b))[0];

    if (winningBlock) return winningBlock.uid;

    // Can't win the trade. Decide whether to sacrifice a blocker.

    // Always block if this hit would kill us.
    if (defender.life <= attSymbols) {
      return blockers.sort((a, b) => ebp(b) - ebp(a))[0].uid;
    }

    // Block with strongest available if life is critical (≤2).
    if (defender.life <= 2) {
      return blockers.sort((a, b) => ebp(b) - ebp(a))[0].uid;
    }

    // Block a multi-symbol attacker (≥2) when life is moderately low (≤4).
    if (attSymbols >= 2 && defender.life <= 4) {
      return blockers.sort((a, b) => ebp(b) - ebp(a))[0].uid;
    }

    return null;
  }
}
