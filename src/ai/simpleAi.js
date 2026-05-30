import { CARD_POOL, PHASES, getEffectiveBP } from "../engine/game.js";

export class SimpleAi {
  choosePlayMagic(game) {
    const state = game.getState();
    const player = state.players[state.currentPlayer];
    if (!player.isAi) return null;
    const candidates = player.hand
      .map((cardId, index) => ({ card: CARD_POOL[cardId], index }))
      .filter((x) => x.card?.type === "magic")
      .filter((x) => game.canPlayMagic(x.index).ok);
    return candidates[0]?.index ?? null;
  }

  chooseDeploy(game) {
    const state = game.getState();
    const player = state.players[state.currentPlayer];
    if (!player.isAi) return null;
    const candidates = player.hand
      .map((cardId, index) => ({ card: CARD_POOL[cardId], index }))
      .filter((x) => x.card?.type === "nexus")
      .filter((x) => game.canDeploy(x.index).ok);
    return candidates[0]?.index ?? null;
  }

  chooseSummon(game) {
    const state = game.getState();
    const player = state.players[state.currentPlayer];
    if (!player.isAi) return null;
    const candidates = player.hand
      .map((cardId, index) => ({ card: CARD_POOL[cardId], index }))
      .filter((x) => x.card?.type === "spirit")
      .filter((x) => game.canSummon(x.index).ok)
      .sort((a, b) => (b.card.bp - a.card.bp) || (a.card.cost - b.card.cost));
    return candidates[0]?.index ?? null;
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
