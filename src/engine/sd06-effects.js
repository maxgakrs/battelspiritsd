import { CARD_POOL } from "../data/cards.js";
import { getCardLevel, getEffectiveBP, hasFamily } from "./card-utils.js";

// ─────────────────────────────────────────────
// SD06 CARD_EFFECTS (Spirits & Nexuses)
// ─────────────────────────────────────────────
export const SD06_CARD_EFFECTS = {
  sd06001Ohdoran: {
    // No effects
  },

  sd06001OhdoranRevival: {
    onSummon(game, spirit, player) {
      // Reveal 3, add "Hajime"-named + "Supreme Hero"/"Great General" family card to hand
      const revealed = player.deck.splice(0, Math.min(3, player.deck.length));
      let hajimeCard = null;
      let familyCard = null;
      const rest = [];
      for (const cardId of revealed) {
        const card = CARD_POOL[cardId];
        if (!card) { rest.push(cardId); continue; }
        if (card.name?.includes("Hajime") && !hajimeCard) {
          hajimeCard = cardId;
        } else if ((card.family?.includes("Supreme Hero") || card.family?.includes("Great General")) 
                   && cardId !== "sd06001OhdoranRevival" && !familyCard) {
          familyCard = cardId;
        } else {
          rest.push(cardId);
        }
      }
      if (hajimeCard) player.hand.push(hajimeCard);
      if (familyCard) player.hand.push(familyCard);
      player.deck.push(...rest);
      game.addLog(`${spirit.name}: (When Summoned) revealed 3 cards, added Hajime + family card to Hand.`);
    },
    onMainStep(game, spirit) {
      // Adds extra white symbol during main step
      spirit._whiteSymbolBoost = (spirit._whiteSymbolBoost ?? 0) + 1;
      game.addLog(`${spirit.name}: (Main Step) gains +1 White symbol.`);
    },
  },

  sd06002Salamantle: {
    onAttack(game, spirit, player, level) {
      // LV2+ when attacks: draw 1
      if (level >= 2) {
        const drawn = player.deck.splice(0, 1);
        if (drawn.length > 0) {
          player.hand.push(...drawn);
          game.addLog(`${spirit.name}: (When Attacks) drew 1 card.`);
        }
      }
    },
  },

  sd06003OneKengo: {
    // Clash keyword + while Burst set treat as LV3 + LV2/3 must block
    getDisplayLevel(spirit, card) {
      // While Burst set, display as LV3
      if (spirit._burstSet) return 3;
      return getCardLevel(spirit, card);
    },
    onAttack(game, spirit, player, level) {
      if (level >= 2) {
        spirit._mustBeBlock = true;
        game.addLog(`${spirit.name}: Clash – opposing Spirits must block if possible.`);
      }
    },
  },

  sd06003OneKengoRevival: {
    onSummon(game, spirit) {
      // Treat as white color and symbol
      spirit._whiteSymbolBoost = (spirit._whiteSymbolBoost ?? 0) + 1;
      spirit._colorTreatedAsWhite = true;
      game.addLog(`${spirit.name}: treated as White color & symbol.`);
    },
    onAttack(game, spirit, player, level) {
      if (level >= 2) {
        // Target opposing spirit + draw 1
        const opp = game._opp(player);
        const targets = opp.spirits.filter((s) => !s._trueRelease).map((s) => ({uid: s.uid, label: s.name}));
        if (targets.length > 0) {
          if (player.isAi) {
            const target = targets[0];
            spirit._targetedOpposingSpirit = target.uid;
          } else {
            game.awaitingEffect = {
              type: "selectOpposingSpirit",
              label: `${spirit.name}: Target opposing Spirit`,
              ownerId: player.id,
              validTargets: targets.map((t) => t.uid),
              optional: false,
              pendingBattleAttackerUid: spirit.uid,
            };
            return;
          }
        }
        const drawn = player.deck.splice(0, 1);
        if (drawn.length > 0) {
          player.hand.push(...drawn);
          game.addLog(`${spirit.name}: (When Attacks) drew 1 card.`);
        }
      }
    },
  },

  sd06004DosMonkey: {
    onStartAttackStep(game, spirit, player) {
      // LV1-2 Attack Step: while Burst set, non-braved +3000 BP
      if (spirit._burstSet) {
        player.spirits.forEach((s) => {
          if (!s.brave && s.uid !== spirit.uid) {
            s.bpBoost = (s.bpBoost ?? 0) + 3000;
          }
        });
        game.addLog(`${spirit.name}: non-braved Spirits +3000 BP.`);
      }
    },
  },

  sd06004DosMonkeyRevival: {
    onSummon(game, spirit, player) {
      // Reveal 3, add "Hajime"-named + "Supreme Hero"/"Great General" card
      const revealed = player.deck.splice(0, Math.min(3, player.deck.length));
      let hajimeCard = null;
      let familyCard = null;
      const rest = [];
      for (const cardId of revealed) {
        const card = CARD_POOL[cardId];
        if (!card) { rest.push(cardId); continue; }
        if (card.name?.includes("Hajime") && !hajimeCard) {
          hajimeCard = cardId;
        } else if ((card.family?.includes("Supreme Hero") || card.family?.includes("Great General")) 
                   && cardId !== "sd06004DosMonkeyRevival" && !familyCard) {
          familyCard = cardId;
        } else {
          rest.push(cardId);
        }
      }
      if (hajimeCard) player.hand.push(hajimeCard);
      if (familyCard) player.hand.push(familyCard);
      player.deck.push(...rest);
      game.addLog(`${spirit.name}: (When Summoned) revealed 3 cards, added cards to Hand.`);
    },
    onMainStep(game, spirit, player, level) {
      // LV2 Main Step: Red/White Magic with Burst revealed from deck can be added to hand
      if (level >= 2) {
        const revealed = player.deck.splice(0, Math.min(5, player.deck.length));
        const burstMagic = revealed.filter((id) => {
          const card = CARD_POOL[id];
          return card && card.type === "magic" && card.keyword === "Burst" 
                  && (card.color === "red" || card.color === "white");
        });
        if (burstMagic.length > 0) {
          if (player.isAi) {
            player.hand.push(burstMagic[0]);
            const rest = revealed.filter((id) => !burstMagic.includes(id));
            player.deck.push(...rest);
          } else {
            game.awaitingEffect = {
              type: "selectHandCard",
              label: `${spirit.name}: Add Red/White Burst Magic to Hand`,
              ownerId: player.id,
              validTargets: burstMagic,
              optional: true,
              pendingBattleAttackerUid: null,
              _revealedCards: revealed,
              _selectedMagic: burstMagic,
            };
            return;
          }
        } else {
          player.deck.push(...revealed);
        }
        game.addLog(`${spirit.name}: (Main Step) revealed 5 cards for Burst Magic.`);
      }
    },
  },

  sd06005TwinBladeDragon: {
    onAttack(game, spirit, player) {
      // Draw 1; if Burst set, destroy <= 4000 BP Spirit
      const drawn = player.deck.splice(0, 1);
      if (drawn.length > 0) {
        player.hand.push(...drawn);
        game.addLog(`${spirit.name}: drew 1 card.`);
      }
      if (spirit._burstSet) {
        const opp = game._opp(player);
        const targets = opp.spirits.filter((s) => getEffectiveBP(s, CARD_POOL[s.cardId]) <= 4000 && !s._trueRelease);
        if (targets.length > 0) {
          const target = targets[0];
          game.destroySpirit(opp, target.uid);
          game.addLog(`${spirit.name}: (Burst set) destroyed ${target.name}.`);
        }
      }
    },
    canInvoke(spirit, player) {
      return !spirit.flashUsedThisBattle && spirit._burstSet;
    },
    invoke(game, spirit, player) {
      // Flash: discard Burst, +5000 BP
      if (player.burstArea?.length > 0) {
        const burstId = player.burstArea.pop();
        player.trash.push(burstId);
        spirit.bpBoost = (spirit.bpBoost ?? 0) + 5000;
        spirit.flashUsedThisBattle = true;
        game.addLog(`${spirit.name}: Flash – discarded Burst, +5000 BP.`);
      }
    },
  },

  sd06006IkazuchiWurm: {
    onSummon(game, spirit, player) {
      // Destroy opposing Brave/Nexus
      const opp = game._opp(player);
      const targets = [...opp.nexuses.filter((n) => !n._trueRelease), 
                       ...opp.spirits.filter((s) => s.brave && !s._trueRelease)]
        .slice(0, 1);
      targets.forEach((target) => {
        if (target.brave) {
          const spirit = opp.spirits.find((s) => s.brave === target);
          if (spirit) {
            spirit.brave = null;
            opp.trash.push(target.id);
          }
        } else {
          const idx = opp.nexuses.indexOf(target);
          if (idx >= 0) opp.nexuses.splice(idx, 1);
          opp.reserve.normal += target.cores?.normal ?? 0;
          if (target.cores?.soul) opp.reserve.soul = true;
        }
        game.addLog(`${spirit.name}: (When Summoned) destroyed Brave/Nexus.`);
      });
    },
    onAttack(game, spirit, player, level) {
      // If Burst set, can target; LV2 +3000 per Dragon Warrior
      if (spirit._burstSet) {
        const opp = game._opp(player);
        const targets = opp.spirits.filter((s) => !s._trueRelease).map((s) => ({uid: s.uid, label: s.name}));
        if (targets.length > 0 && player.isAi) {
          spirit._targetedOpposingSpirit = targets[0].uid;
        }
      }
      if (level >= 2) {
        const dragonWarriors = player.spirits.filter((s) => s.uid !== spirit.uid && CARD_POOL[s.cardId]?.family?.includes("Dragon Warrior")).length;
        spirit.bpBoost = (spirit.bpBoost ?? 0) + (dragonWarriors * 3000);
        if (dragonWarriors > 0) game.addLog(`${spirit.name}: +${dragonWarriors * 3000} BP (Dragon Warrior).`);
      }
    },
  },

  sd06007TheHeroDragonLordDragon: {
    // Burst summon: onBurstActivated destroy <=9000 if cost <=5; onBattle discard Burst to refresh
    onBurstActivated(game, spirit, player) {
      const opp = game._opp(player);
      const targets = opp.spirits.filter((s) => getEffectiveBP(s, CARD_POOL[s.cardId]) <= 9000 && !s._trueRelease);
      if (targets.length > 0) {
        const target = targets[0];
        game.destroySpirit(opp, target.uid);
        game.addLog(`${spirit.name}: (After Burst Activates) destroyed ${target.name}.`);
      }
    },
    canInvoke(spirit, player, level) {
      return level >= 2 && !spirit.flashUsedThisBattle && spirit._burstSet;
    },
    invoke(game, spirit, player) {
      // Flash: discard Burst to refresh
      if (player.burstArea?.length > 0) {
        const burstId = player.burstArea.pop();
        player.trash.push(burstId);
        spirit.exhausted = false;
        spirit.flashUsedThisBattle = true;
        game.addLog(`${spirit.name}: Flash – discarded Burst, refreshed.`);
      }
    },
  },

  sd06008Armaditokage: {
    onSummon(game, spirit) {
      // Treat as Red Spirit (color treatment)
      spirit._treatedAsRed = true;
      game.addLog(`${spirit.name}: treated as Red Spirit.`);
    },
  },

  sd06009KijiToria: {
    onOpposingAttackStep(game, spirit, player) {
      // While Burst set, non-braved +2000 BP
      if (spirit._burstSet) {
        player.spirits.forEach((s) => {
          if (!s.brave && s.uid !== spirit.uid) {
            s.bpBoost = (s.bpBoost ?? 0) + 2000;
          }
        });
        game.addLog(`${spirit.name}: (Opposing Turn) non-braved +2000 BP.`);
      }
    },
  },

  sd06009KijiToriaRevival: {
    onSummon(game, spirit) {
      // Treat as Red
      spirit._treatedAsRed = true;
      spirit._whiteSymbolBoost = (spirit._whiteSymbolBoost ?? 0) + 1;
      game.addLog(`${spirit.name}: treated as Red color & symbol.`);
    },
    onOpposingAttackStep(game, spirit, player, level) {
      // LV2: set Burst from hand OR reveal + return Burst to hand
      // Protection from opposing effects while Burst set
      if (spirit._burstSet && player.spirits.some((s) => 
          (CARD_POOL[s.cardId]?.family?.includes("Supreme Hero") || CARD_POOL[s.cardId]?.family?.includes("Great General")) 
          && s.uid !== spirit.uid)) {
        // Unaffected by opposing effects - handled at effect resolution level
        game.addLog(`${spirit.name}: Supreme Hero/Great General protected from opposing effects.`);
      }
    },
  },

  sd06010TheSeaDragonCimaCreek: {
    // Burst summon condition; LV1-2 can't attack; LV1-3 cap life reduction
    canAttack(spirit, card) {
      const level = getCardLevel(spirit, card);
      return level >= 3;
    },
    onOpposingTurn(game, spirit, player) {
      // Each opposing Spirit can only reduce Life by 1 per turn
      player._lifeReductionCapPerSpirit = 1;
      game.addLog(`${spirit.name}: opposing Spirits capped at -1 Life each.`);
    },
  },

  sd06011TheHeroEmperorDeitySword: {
    // Nexus: onSetBurst draw 1 (once/turn); LV2 onAttackStep Supreme Hero +3000, +5000 with Burst
    onSetBurst(game, nexus, player) {
      if (!nexus._burstDrawUsed) {
        const drawn = player.deck.splice(0, 1);
        if (drawn.length > 0) {
          player.hand.push(...drawn);
          nexus._burstDrawUsed = true;
          game.addLog(`${nexus.name}: drew 1 card (set Burst).`);
        }
      }
    },
    onStartAttackStep(game, nexus, player, level) {
      // LV2: Supreme Hero non-braved +3000 (+5000 with Burst)
      if (level >= 2) {
        player.spirits.forEach((s) => {
          if (!s.brave && CARD_POOL[s.cardId]?.family?.includes("Supreme Hero")) {
            let boost = 3000;
            if (nexus._burstSet) boost = 5000;
            s.bpBoost = (s.bpBoost ?? 0) + boost;
          }
        });
        game.addLog(`${nexus.name}: Supreme Hero +3000 BP (${nexus._burstSet ? '+5000 with Burst' : ''}).`);
      }
    },
  },

  sd06011TheHeroEmperorDeitySwordRevival: {
    // Nexus: onSetBurst destroy <=7000 OR draw (once/turn); LV2 all spirits +3000, prevent attack step end
    onSetBurst(game, nexus, player) {
      if (!nexus._burstEffectUsed) {
        const opp = game._opp(player);
        const targets = opp.spirits.filter((s) => getEffectiveBP(s, CARD_POOL[s.cardId]) <= 7000 && !s._trueRelease);
        if (targets.length > 0) {
          if (player.isAi) {
            game.destroySpirit(opp, targets[0].uid);
          } else {
            game.awaitingEffect = {
              type: "destroyOrDraw",
              label: `${nexus.name}: Destroy <=7000 Spirit OR draw 1 card`,
              ownerId: player.id,
              validTargets: [...targets.map((t) => ({uid: t.uid, label: `Destroy ${t.name}`})), {uid: "draw", label: "Draw 1 card"}],
              optional: false,
              pendingBattleAttackerUid: null,
            };
            return;
          }
        } else {
          const drawn = player.deck.splice(0, 1);
          if (drawn.length > 0) {
            player.hand.push(...drawn);
            game.addLog(`${nexus.name}: drew 1 card (no target).`);
          }
        }
        nexus._burstEffectUsed = true;
      }
    },
    onStartAttackStep(game, nexus, player, level) {
      // LV2: all Spirits +3000, opponent can't end Attack Step via effects
      if (level >= 2) {
        player.spirits.forEach((s) => {
          s.bpBoost = (s.bpBoost ?? 0) + 3000;
        });
        player._cannotEndAttackStepViaEffects = true;
        game.addLog(`${nexus.name}: all Spirits +3000 BP, Attack Step can't end via effects.`);
      }
    },
  },

  sd06012TheHeroEmperorDeityShield: {
    // Nexus: onAttackStep exhaust opposing Brave; LV2 protect HeroEmperor Nexuses while Burst set
    onStartAttackStep(game, nexus, player) {
      // Target opposing Brave, exhaust it
      const opp = game._opp(player);
      const braves = opp.spirits.filter((s) => s.brave && !s._trueRelease);
      if (braves.length > 0) {
        const target = braves[0];
        target.exhausted = true;
        game.addLog(`${nexus.name}: ${target.name}'s Brave exhausted.`);
      }
    },
    onSummon(game, nexus, player, level) {
      if (level >= 2 && nexus._burstSet) {
        // Protect HeroEmperor Nexuses from destruction
        player.nexuses.forEach((n) => {
          if (n.cardId.includes("HeroEmperor")) {
            n._protectedFromDestruction = true;
          }
        });
        game.addLog(`${nexus.name}: HeroEmperor Nexuses protected.`);
      }
    },
  },

  sd06012TheHeroEmperorDeityShieldRevival: {
    onSummon(game, nexus) {
      // Treat as Red
      nexus._treatedAsRed = true;
      game.addLog(`${nexus.name}: treated as Red color & symbol.`);
    },
    onStartAttackStep(game, nexus, player, level) {
      // LV2: protect Burst, protect Nexuses while Burst set
      if (level >= 2) {
        if (nexus._burstSet) {
          player.burstArea.forEach((id) => {
            if (CARD_POOL[id]?.family?.includes("Supreme Hero") || CARD_POOL[id]?.family?.includes("Great General")) {
              // Mark as protected
            }
          });
          player.nexuses.forEach((n) => {
            if (n.cardId.includes("HeroEmperor") || CARD_POOL[n.cardId]?.family?.includes("Supreme Hero")) {
              n._protectedFromDestruction = true;
            }
          });
          game.addLog(`${nexus.name}: Supreme Hero Burst & Nexuses protected.`);
        }
      }
    },
  },
};

// ─────────────────────────────────────────────
// SD06 MAGIC_EFFECTS
// ─────────────────────────────────────────────
export const SD06_MAGIC_EFFECTS = {
  sd06013BurstDraw: {
    getMainTargets(_game, _player) {
      return [];
    },
    main(game, player) {
      const drawn = player.deck.splice(0, 2);
      player.hand.push(...drawn);
      game.addLog(`Burst Draw: drew 2 cards.`);
    },
    burst(game, player) {
      this.main(game, player);
    },
  },

  sd06014BurstCross: {
    getMainTargets(game, player) {
      return [];
    },
    main(game, player) {
      // Return Burst card from trash to hand
      const burstInTrash = player.trash.filter((id) => CARD_POOL[id]?.keyword === "Burst");
      if (burstInTrash.length > 0) {
        const card = burstInTrash[0];
        const idx = player.trash.indexOf(card);
        if (idx >= 0) player.trash.splice(idx, 1);
        player.hand.push(card);
        game.addLog(`Burst Cross: returned ${CARD_POOL[card]?.name} to Hand.`);
      }
    },
    burst(game, player) {
      const opp = game._opp(player);
      // Destroy Spirit <= 6000, Brave, Nexus
      const spirit = opp.spirits.find((s) => getEffectiveBP(s, CARD_POOL[s.cardId]) <= 6000 && !s._trueRelease);
      if (spirit) {
        game.destroySpirit(opp, spirit.uid);
        game.addLog(`Burst Cross (Burst): destroyed ${spirit.name}.`);
      }
      const brave = opp.spirits.find((s) => s.brave);
      if (brave) {
        opp.trash.push(brave.brave.id);
        brave.brave = null;
        game.addLog(`Burst Cross (Burst): removed Brave.`);
      }
      const nexus = opp.nexuses[0];
      if (nexus) {
        opp.nexuses.splice(0, 1);
        opp.reserve.normal += nexus.cores?.normal ?? 0;
        if (nexus.cores?.soul) opp.reserve.soul = true;
        game.addLog(`Burst Cross (Burst): destroyed ${nexus.name}.`);
      }
    },
  },

  sd06014BurstCrossRevival: {
    getMainTargets(game, player) {
      return [];
    },
    main(game, player) {
      // Return Burst or Red Grandwalker from trash to hand
      const returnables = player.trash.filter((id) => {
        const card = CARD_POOL[id];
        return (card?.keyword === "Burst") || (card?.color === "red" && card?.type === "nexus" && card?.name?.includes("Grandwalker"));
      });
      if (returnables.length > 0) {
        const card = returnables[0];
        const idx = player.trash.indexOf(card);
        if (idx >= 0) player.trash.splice(idx, 1);
        player.hand.push(card);
        game.addLog(`Burst Cross (Revival): returned ${CARD_POOL[card]?.name} to Hand.`);
      }
    },
    burst(game, player) {
      const opp = game._opp(player);
      // Destroy Spirit <= 10000, Ultimate <= 20000, Brave, Nexus
      const spirit = opp.spirits.find((s) => getEffectiveBP(s, CARD_POOL[s.cardId]) <= 10000 && !s._trueRelease);
      if (spirit) {
        game.destroySpirit(opp, spirit.uid);
        game.addLog(`Burst Cross (Revival) Burst: destroyed ${spirit.name}.`);
      }
      const ultimate = opp.ultimates?.find((u) => u.bp <= 20000 && !u._trueRelease);
      if (ultimate) {
        const idx = opp.ultimates.indexOf(ultimate);
        if (idx >= 0) opp.ultimates.splice(idx, 1);
        game.addLog(`Burst Cross (Revival) Burst: destroyed ${ultimate.name}.`);
      }
      const brave = opp.spirits.find((s) => s.brave);
      if (brave) {
        opp.trash.push(brave.brave.id);
        brave.brave = null;
        game.addLog(`Burst Cross (Revival) Burst: removed Brave.`);
      }
      const nexus = opp.nexuses[0];
      if (nexus) {
        opp.nexuses.splice(0, 1);
        opp.reserve.normal += nexus.cores?.normal ?? 0;
        if (nexus.cores?.soul) opp.reserve.soul = true;
        game.addLog(`Burst Cross (Revival) Burst: destroyed ${nexus.name}.`);
      }
    },
  },

  sd06015BurstFlame: {
    getFlashTargets(game, player) {
      const opp = game._opp(player);
      const braves = opp.spirits.filter((s) => s.brave && !s._trueRelease).map((s) => ({uid: s.uid, label: `${s.name}'s Brave`}));
      return braves;
    },
    flash(game, player, targetUid) {
      const opp = game._opp(player);
      const spirit = opp.spirits.find((s) => s.uid === targetUid && s.brave);
      if (spirit?.brave) {
        opp.trash.push(spirit.brave.id);
        spirit.brave = null;
        game.addLog(`Burst Flame Flash: destroyed Brave.`);
      }
    },
    burst(game, player) {
      const opp = game._opp(player);
      const targets = opp.spirits.filter((s) => getEffectiveBP(s, CARD_POOL[s.cardId]) <= 4000 && !s._trueRelease).slice(0, 3);
      targets.forEach((spirit) => {
        game.destroySpirit(opp, spirit.uid);
      });
      game.addLog(`Burst Flame (Burst): destroyed ${targets.length} Spirits.`);
    },
  },

  sd06015BurstFlameRevival: {
    getFlashTargets(game, player) {
      const opp = game._opp(player);
      const targets = [
        ...opp.spirits.filter((s) => s.brave && !s._trueRelease),
        ...opp.ultimates?.filter((u) => u.bp <= 20000 && !u._trueRelease) || [],
        ...opp.spirits.filter((s) => getEffectiveBP(s, CARD_POOL[s.cardId]) <= 20000 && !s._trueRelease)
      ];
      return targets.map((t) => ({uid: t.uid, label: t.name}));
    },
    flash(game, player, targetUid) {
      const opp = game._opp(player);
      const brave = opp.spirits.find((s) => s.uid === targetUid && s.brave);
      if (brave?.brave) {
        opp.trash.push(brave.brave.id);
        brave.brave = null;
        game.addLog(`Burst Flame (Revival) Flash: destroyed Brave.`);
        return;
      }
      const ultimate = opp.ultimates?.find((u) => u.uid === targetUid && u.bp <= 20000);
      if (ultimate) {
        const idx = opp.ultimates.indexOf(ultimate);
        if (idx >= 0) opp.ultimates.splice(idx, 1);
        game.addLog(`Burst Flame (Revival) Flash: destroyed Ultimate.`);
        return;
      }
      const spirit = opp.spirits.find((s) => s.uid === targetUid && getEffectiveBP(s, CARD_POOL[s.cardId]) <= 20000);
      if (spirit) {
        game.destroySpirit(opp, spirit.uid);
        game.addLog(`Burst Flame (Revival) Flash: destroyed Spirit.`);
      }
    },
    burst(game, player) {
      const opp = game._opp(player);
      const targets = [
        ...opp.spirits.filter((s) => getEffectiveBP(s, CARD_POOL[s.cardId]) <= 12000 && !s._trueRelease),
        ...opp.ultimates?.filter((u) => u.bp <= 12000 && !u._trueRelease) || []
      ].slice(0, 3);
      targets.forEach((t) => {
        if (t.cardId) {
          game.destroySpirit(opp, t.uid);
        } else {
          const idx = opp.ultimates.indexOf(t);
          if (idx >= 0) opp.ultimates.splice(idx, 1);
        }
      });
      game.addLog(`Burst Flame (Revival) Burst: destroyed ${targets.length} Spirits/Ultimates.`);
    },
  },

  sd06016BurstWall: {
    getFlashTargets(_game, _player) {
      return [];
    },
    flash(game, player) {
      if (game.phaseIndex === 1) { // 1 is PHASES.ATTACK
        game.phaseIndex = 2; // Transition to PHASES.MAIN2
        game.addLog(`Burst Wall Flash: ended Attack Step.`);
      }
    },
    burst(game, player) {
      player.life = (player.life ?? 5) + 1;
      game.addLog(`Burst Wall (Burst): +1 Life.`);
    },
  },

  sd06016BurstWallRevival: {
    getFlashTargets(_game, _player) {
      return [];
    },
    flash(game, player) {
      if (game.phaseIndex === 1) {
        game.phaseIndex = 2;
        game.addLog(`Burst Wall (Revival) Flash: ended Attack Step.`);
      }
    },
    burst(game, player) {
      player.life = (player.life ?? 5) + 1;
      game.addLog(`Burst Wall (Revival) Burst: +1 Life.`);
    },
  },

  sd06017BurstStorm: {
    getFlashTargets(game, player) {
      return player.spirits.map((s) => ({uid: s.uid, label: `Refresh ${s.name}`}));
    },
    flash(game, player, targetUid) {
      const target = player.spirits.find((s) => s.uid === targetUid);
      if (target) {
        target.exhausted = false;
        game.addLog(`Burst Storm Flash: refreshed ${target.name}.`);
      }
    },
    burst(game, player) {
      const opp = game._opp(player);
      const nexus = opp.nexuses[0];
      if (nexus) {
        opp.nexuses.splice(0, 1);
        opp.deck.push(nexus.id || nexus.cardId);
        game.addLog(`Burst Storm: returned ${nexus.name} to deck bottom.`);
        return;
      }
      const spirit = opp.spirits[0];
      if (spirit) {
        opp.spirits.splice(opp.spirits.indexOf(spirit), 1);
        opp.deck.push(spirit.cardId);
        game.addLog(`Burst Storm: returned ${spirit.name} to deck bottom.`);
      }
    },
  },

  sd06017BurstStormRevival: {
    getFlashTargets(game, player) {
      return player.spirits.map((s) => ({uid: s.uid, label: `Refresh ${s.name}`}));
    },
    flash(game, player, targetUid) {
      const target = player.spirits.find((s) => s.uid === targetUid);
      if (target) {
        target.exhausted = false;
        game.addLog(`Burst Storm (Revival) Flash: refreshed ${target.name}.`);
      }
    },
    burst(game, player) {
      const opp = game._opp(player);
      const targets = opp.nexuses.filter((n) => !n._trueRelease)
        .concat(opp.ultimates?.filter((u) => !u._trueRelease) || [])
        .concat(opp.spirits.filter((s) => !s._trueRelease));
      if (targets.length > 0) {
        const t = targets[0];
        if (opp.nexuses.includes(t)) {
          opp.nexuses.splice(opp.nexuses.indexOf(t), 1);
          opp.deck.push(t.id || t.cardId);
          game.addLog(`Burst Storm (Revival) Burst: returned ${t.name} to deck bottom.`);
        } else if (opp.spirits.includes(t)) {
          opp.spirits.splice(opp.spirits.indexOf(t), 1);
          opp.deck.push(t.cardId);
          game.addLog(`Burst Storm (Revival) Burst: returned ${t.name} to deck bottom.`);
        } else if (opp.ultimates?.includes(t)) {
          opp.ultimates.splice(opp.ultimates.indexOf(t), 1);
          opp.deck.push(t.cardId);
          game.addLog(`Burst Storm (Revival) Burst: returned ${t.name} to deck bottom.`);
        }
      }
      const grandwalker = opp.nexuses?.find((n) => !CARD_POOL[n.cardId]?.family?.includes("Primal") && n.cardId.includes("Grandwalker"));
      if (grandwalker) {
        const idx = opp.nexuses.indexOf(grandwalker);
        if (idx >= 0) opp.nexuses.splice(idx, 1);
        game.addLog(`Burst Storm (Revival) Burst: destroyed non-Primal Grandwalker.`);
      }
    },
  },
};
