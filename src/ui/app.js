import { BattleSpiritGame, CARD_POOL, PHASES, getCardLevel, getEffectiveBP } from "../engine/game.js";
import { DECKS } from "../data/cards.js";
import { SimpleAi } from "../ai/simpleAi.js";

const root = document.getElementById("app");
const ai = new SimpleAi();
const prevExhausted = new Set(); // UIDs exhausted in the previous render
let cardDetailId = null;
let cardDetailIndex = null; // Track hand index for action buttons
let battleLogModalOpen = false;
let trashModalOwner = null; // null | 0 (you) | 1 (AI)
let blockShowAttackerInfo = false;
let prevPhase = null;
let prevTurnNumber = -1;
let prevHandLengths = [0, 0];
let prevSpiritUids = [new Set(), new Set()];

let screen = "menu";
let selectedPlayerDeck = "deck26RSD01";
let selectedAiDeck = "deck26RSD01";
let game = null;

// Interactive summon flow state
// { step:'payment'|'placement', handIndex, card, baseCost, reduction, actualCost, lv1Min, legacyAvailable, legacyBanishCount, paySpec, placeSpec }
let summonFlow = null;

// Magic effect choice state (for cards with both Main and Flash effects)
// { handIndex, card }
let magicEffectChoice = null;

// Magic payment flow state (for all magic cost payment — Flash Window and Main Step)
// { context:'flashWindow'|'main'|'mainFlash', handIndex, card, baseCost, actualCost, paySpec }
let magicPayFlow = null;

// Nexus deployment payment flow state
// { handIndex, card, baseCost, actualCost, paySpec }
let nexusPayFlow = null;

// Multi-select card effect state (for Feeding Draw, Menhir Circle, Rock Drilling etc)
// { selectedCards: [], maxSelect: N }
let multiSelectCards = null;

let gallerySearch = "";
let galleryColorFilter = null;
let galleryTypeFilter = null;
let gallerySetFilter = null;
let galleryFormatFilter = null;
let galleryDetailId = null;

let deckListViewId = null;

const SET_LABELS = {
  bs01: "BS01",
  rsd01: "26RSD01", rsd02: "26RSD02", rsd03: "26RSD03",
  rsd04: "26RSD04", rsd05: "26RSD05", rsd06: "26RSD06",
  rbs01: "RBS01", rp26: "RP26",
};

const CORE_ICON = "./assets/core.png";
const SOUL_CORE_ICON = "./assets/soul_core.png";

// ─── Animation helpers ────────────────────────────────────────────────────────

let _bannerTimer = null;
let _seqTimers = [];
let _lastBannerEndTime = 0;
let _revealEndTime = 0;
let _pendingActionLabel = null;

function _getOverlay() {
  let el = document.getElementById("anim-overlay");
  if (!el) {
    el = document.createElement("div");
    el.id = "anim-overlay";
    document.body.appendChild(el);
  }
  return el;
}

function _cancelAll() {
  _seqTimers.forEach(t => clearTimeout(t));
  _seqTimers = [];
  if (_bannerTimer) { clearTimeout(_bannerTimer); _bannerTimer = null; }
}

// Internal: set overlay content directly (does NOT cancel sequence)
function _setBanner(text, color, flash, isStep) {
  const overlay = _getOverlay();
  if (_bannerTimer) clearTimeout(_bannerTimer);
  overlay.className = flash ? "anim-overlay-flash" : "";
  overlay.innerHTML = `<span class="phase-banner-text${isStep ? " step" : ""}" style="color:${color}">${text}</span>`;
  _bannerTimer = setTimeout(() => { overlay.innerHTML = ""; overlay.className = ""; }, 1600);
}

// Show a single banner (cancels any running sequence)
function showBanner(text, color = "#fff", flash = false) {
  _cancelAll();
  _lastBannerEndTime = Date.now() + 1600;
  _setBanner(text, color, flash, false);
}

// Show steps sequentially: [{text, color}], each for ~stepMs then next fires
function showBannerSequence(steps, stepMs = 520) {
  _cancelAll();
  const gap = 80;
  _lastBannerEndTime = Date.now() + steps.length * (stepMs + gap) + 1600;
  steps.forEach(({ text, color = "#fff" }, i) => {
    const isLast = i === steps.length - 1;
    _seqTimers.push(setTimeout(() => _setBanner(text, color, false, !isLast), i * (stepMs + gap)));
  });
}

// Show keyword(s) from a card as step-style banners in the card's color
function _showKeywordBanner(cardId) {
  const card = CARD_POOL[cardId];
  if (!card?.keyword) return;
  const color = COLOR_CSS[card.color] ?? "#fff";
  const kw = card.keyword;
  const keywords = Array.isArray(kw)
    ? kw
    : String(kw).split(/[,/]/).map((s) => s.trim()).filter(Boolean);
  if (!keywords.length) return;
  _cancelAll();
  const stepMs = 600;
  const gap = 80;
  _lastBannerEndTime = Date.now() + keywords.length * (stepMs + gap) + 400;
  keywords.forEach((text, i) => {
    _seqTimers.push(setTimeout(() => _setBanner(text, color, false, true), i * (stepMs + gap)));
  });
}

function _colorAlpha(hex, a) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
}

function _getCardRarity(card) {
  if (/X\d+/i.test(card.id)) return "xrare";
  if (card.keyword) return "rare";
  return "common";
}

function _showCardReveal(card) {
  if (!card?.image) return;
  document.getElementById("card-reveal-overlay")?.remove();
  const rarity = _getCardRarity(card);
  const color = COLOR_CSS[card.color] ?? "#ffffff";
  const dur = rarity === "xrare" ? 2800 : rarity === "rare" ? 2100 : 1500;
  const el = document.createElement("div");
  el.id = "card-reveal-overlay";
  el.className = `cro-${rarity}`;
  el.style.setProperty("--cro-color", color);
  el.style.setProperty("--cro-color-faint", _colorAlpha(color, 0.12));
  el.style.setProperty("--cro-color-mid",   _colorAlpha(color, 0.32));
  const rawKw = card.keyword;
  const keyword = rawKw
    ? (Array.isArray(rawKw) ? rawKw[0] : String(rawKw).split(/[,/]/)[0].trim())
    : null;
  el.innerHTML = `
    <div class="cro-backdrop"></div>
    ${rarity === "xrare" ? `<div class="cro-rings"></div>` : ""}
    <div class="cro-card-wrap">
      <div class="cro-aura"></div>
      <img class="cro-card-img" src="${card.image}" alt="${card.name}">
    </div>
    <div class="cro-label">${card.name}</div>
    ${keyword ? `<div class="cro-keyword">◆ ${keyword}</div>` : ""}
  `;
  _revealEndTime = Date.now() + dur;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), dur);
}

function _spawnFlyingCard(fromEl, toEl, delay = 0) {
  if (!fromEl || !toEl) return;
  const fromRect = fromEl.getBoundingClientRect();
  const toRect = toEl.getBoundingClientRect();
  const img = document.createElement('img');
  img.src = './assets/BS_back.webp';
  img.className = 'flying-card';
  img.style.left = `${fromRect.left + fromRect.width / 2 - 19}px`;
  img.style.top  = `${fromRect.top  + fromRect.height / 2 - 27}px`;
  img.style.opacity = '0';
  document.body.appendChild(img);
  setTimeout(() => {
    img.style.opacity = '1';
    requestAnimationFrame(() => requestAnimationFrame(() => {
      img.style.transition = [
        'left 0.38s cubic-bezier(0.25,0.46,0.45,0.94)',
        'top 0.38s cubic-bezier(0.25,0.46,0.45,0.94)',
        'opacity 0.18s ease 0.24s',
        'transform 0.38s ease',
      ].join(',');
      img.style.left    = `${toRect.left + toRect.width / 2 - 19}px`;
      img.style.top     = `${toRect.top  + toRect.height / 2 - 27}px`;
      img.style.opacity = '0';
      img.style.transform = 'scale(0.6)';
      setTimeout(() => img.remove(), 450);
    }));
  }, delay);
}

function applyMatchAnimations(state, destroyedUids, snapHandLengths) {
  // 1. Phase / turn banner
  const isNewTurn = state.turnNumber !== prevTurnNumber;
  const isPhaseChange = state.phase !== prevPhase;
  let bannerShown = false;
  if (prevPhase !== null && (isNewTurn || isPhaseChange)) {
    if (destroyedUids.size === 0) {
      if (isNewTurn) {
        showBannerSequence([
          { text: "Start",   color: "#aaaaaa" },
          { text: "Core",    color: "#f0c040" },
          { text: "Draw",    color: "#60c0f0" },
          { text: "Refresh", color: "#80f0a0" },
        ]);
      } else {
        const labels = { MAIN: "Main Phase", ATTACK: "Attack!", MAIN2: "Main Phase 2" };
        const colors = { MAIN: "#dbf0ff", ATTACK: "#ff8c42", MAIN2: "#b8f0a0" };
        showBanner(labels[state.phase] ?? state.phase, colors[state.phase] ?? "#fff");
      }
      bannerShown = true;
    }
  }
  prevPhase = state.phase;
  prevTurnNumber = state.turnNumber;

  // 2. Spirit refresh animation (was exhausted, now is not)
  state.players.forEach((player) => {
    [...player.spirits, ...(player.nexuses ?? [])].forEach((s) => {
      if (prevExhausted.has(s.uid) && !s.exhausted) {
        document.querySelector(`[data-uid="${s.uid}"] .spirit-chip`)?.classList.add("refreshed");
      }
    });
  });

  // 3. Attacker highlight when human must choose block
  if (state.awaitingBlock) {
    document.querySelector(`[data-uid="${state.awaitingBlock.attackerUid}"] .spirit-chip`)
      ?.classList.add("attacking");
  }

  // 4. Draw animation — flying card from deck + slide-in for hand cards
  state.players.forEach((player, i) => {
    const diff = player.hand.length - snapHandLengths[i];
    if (diff <= 0) return;
    const deckEl = document.getElementById(i === 0 ? "deck-pile-you" : "deck-pile-ai");
    const handEl = document.querySelector(i === 0 ? ".bottom-strip" : ".ai-hand-strip");
    for (let j = 0; j < diff; j++) _spawnFlyingCard(deckEl, handEl, j * 90);
    const sel = i === 0 ? ".hand-panel .hand-card" : ".ai-hand-list .ai-hand-card";
    const items = Array.from(document.querySelectorAll(sel));
    items.slice(items.length - diff).forEach((el, j) => {
      el.style.animationDelay = `${j * 0.07}s`;
      el.classList.add("drawn");
    });
  });

  // 5. Destroy flash
  if (destroyedUids.size > 0) {
    showBanner("Destroyed!", "#ff4d6d", true);
    bannerShown = true;
  }

  // 6. Show player action label if nothing more important fired
  if (!bannerShown && _pendingActionLabel) {
    showBanner(_pendingActionLabel.text, _pendingActionLabel.color);
  }
  _pendingActionLabel = null;
}

// ─── AI loop ─────────────────────────────────────────────────────────────────

const _delay = ms => new Promise(r => setTimeout(r, ms));
let _aiRunning = false;

// Wait until banner + card-reveal animations finish, with a minimum floor
async function _waitForAnim(minMs = 400) {
  const remaining = Math.max(_lastBannerEndTime, _revealEndTime) - Date.now();
  await _delay(Math.max(remaining, minMs));
}

function aiBlockChooser(stateView, attackerUid) {
  return ai.chooseBlock(stateView, attackerUid);
}

async function runAiTurnLoop() {
  if (!game || _aiRunning) return;
  _aiRunning = true;
  try {
    // Wait for any banner (turn sequence Start/Core/Draw/Refresh) to finish first
    await _waitForAnim(0);

    let safety = 60;
    while (safety-- > 0) {
      const s = game.getState();
      const p = s.players[s.currentPlayer];
      if (s.winner !== null || !p.isAi || s.awaitingBlock) break;

      if (s.awaitingEffect && s.awaitingEffect.ownerId === s.currentPlayer) {
        showBanner(s.awaitingEffect.label, "#60d0ff");
        await _delay(900);
        game.resolveEffect(s.awaitingEffect.validTargets[0] ?? null, aiBlockChooser);
        render(); await _waitForAnim(500); continue;
      }
      if (s.awaitingEffect) break;
      if (s.awaitingFlash) break;

      if (s.phase === PHASES.MAIN || s.phase === PHASES.MAIN2) {
        const levelUp = ai.chooseLevelUp(game);
        if (levelUp) {
          game.moveCore("reserve", null, "spirit", levelUp.spiritUid, false);
          render(); await _waitForAnim(200); continue;
        }
        const deployIdx = ai.chooseDeploy(game);
        if (deployIdx !== null) {
          const card = CARD_POOL[p.hand[deployIdx]];
          if (card) _showCardReveal(card);
          showBanner(`AI deploys: ${card?.name ?? "Nexus"}`, "#22c55e");
          await _delay(900);
          game.deployNexus(deployIdx); render(); await _waitForAnim(600); continue;
        }
        const magicIdx = ai.choosePlayMagic(game);
        if (magicIdx !== null) {
          const card = CARD_POOL[p.hand[magicIdx]];
          if (card) _showCardReveal(card);
          showBanner(`AI plays: ${card?.name ?? "Magic"}`, "#a855f7");
          await _delay(900);
          game.playMagic(magicIdx); render(); await _waitForAnim(600); continue;
        }
        const summonIdx = ai.chooseSummon(game);
        if (summonIdx !== null) {
          const card = CARD_POOL[p.hand[summonIdx]];
          if (card) _showCardReveal(card);
          showBanner(`AI summons: ${card?.name ?? "Spirit"}`, "#f97316");
          await _delay(900);
          game.summon(summonIdx); render(); await _waitForAnim(600); continue;
        }
        game.nextPhase(); render(); await _waitForAnim(300); continue;
      }

      if (s.phase === PHASES.ATTACK) {
        const attackers = ai.chooseAttackers(game);
        if (!attackers.length) { game.nextPhase(); render(); await _waitForAnim(300); continue; }
        const attacker = p.spirits.find((sp) => sp.uid === attackers[0]);
        showBanner(`AI: ${attacker?.name ?? "Spirit"} attacks!`, "#ff6030", true);
        await _delay(900);
        game.declareAttack(attackers[0], aiBlockChooser); render(); await _waitForAnim(900); continue;
      }
    }
  } finally {
    _aiRunning = false;
  }
}

// ─── Actions ─────────────────────────────────────────────────────────────────

function startGame() {
  _cancelAll();
  _aiRunning = false;
  prevExhausted.clear();
  prevPhase = null;
  prevTurnNumber = -1;
  prevHandLengths = [0, 0];
  prevSpiritUids = [new Set(), new Set()];
  cardDetailId = null;
  cardDetailIndex = null;
  battleLogModalOpen = false;
  summonFlow = null;
  magicEffectChoice = null;
  game = new BattleSpiritGame({ playerDeckId: selectedPlayerDeck, aiDeckId: selectedAiDeck });
  screen = "match";
  render();
}

// ── Summon flow helpers ─────────────────────────────────────────────────────

function _sfSpecTotal(spec) {
  let t = (spec.reserve?.normal ?? 0) + (spec.reserve?.soul ? 1 : 0);
  for (const v of Object.values(spec.spirits ?? {})) t += (v.normal ?? 0) + (v.soul ? 1 : 0);
  for (const v of Object.values(spec.nexuses ?? {})) t += (v.normal ?? 0) + (v.soul ? 1 : 0);
  return t;
}

function _sfEmptySpec() {
  return { reserve: { normal: 0, soul: false }, spirits: {}, nexuses: {} };
}

function openSummonFlow(handIndex) {
  const verdict = game.canSummon(handIndex);
  if (!verdict.ok) return;
  const { card, actualCost, lv1Min, legacyAvailable } = verdict;
  cardDetailId = null; cardDetailIndex = null;
  summonFlow = {
    step: 'payment',
    handIndex,
    card,
    baseCost: card.cost,
    reduction: card.cost - actualCost,
    actualCost,
    lv1Min,
    legacyAvailable: legacyAvailable ?? 0,
    legacyBanishCount: 0,
    paySpec: _sfEmptySpec(),
    placeSpec: _sfEmptySpec(),
  };
  renderModals(game?.getState());
}

function _sfAdjust(step, zone, dir) {
  const player = game.getState().players[0];
  const flow = summonFlow ?? magicPayFlow ?? nexusPayFlow;
  if (!flow) return;
  const spec = step === 'payment' ? flow.paySpec : (flow.placeSpec ?? flow.paySpec);
  const paySpec = flow.paySpec;

  function avail(currentInZone, paySelected) {
    return step === 'payment' ? currentInZone : currentInZone - (paySelected ?? 0);
  }

  if (zone === 'reserve') {
    const max = avail(player.reserve.normal, paySpec.reserve?.normal ?? 0);
    const cur = spec.reserve.normal;
    spec.reserve.normal = Math.max(0, Math.min(max, cur + dir));
  } else {
    const sp = player.spirits.find(s => s.uid === zone);
    if (sp) {
      if (!spec.spirits[zone]) spec.spirits[zone] = { normal: 0, soul: false };
      const max = avail(sp.cores.normal, paySpec.spirits?.[zone]?.normal ?? 0);
      spec.spirits[zone].normal = Math.max(0, Math.min(max, spec.spirits[zone].normal + dir));
    } else {
      const nx = player.nexuses.find(n => n.uid === zone);
      if (nx) {
        if (!spec.nexuses[zone]) spec.nexuses[zone] = { normal: 0, soul: false };
        const max = avail(nx.cores.normal, paySpec.nexuses?.[zone]?.normal ?? 0);
        spec.nexuses[zone].normal = Math.max(0, Math.min(max, spec.nexuses[zone].normal + dir));
      }
    }
  }
  renderModals(game?.getState());
}

function _sfToggleSoul(step, zone) {
  const player = game.getState().players[0];
  const flow = summonFlow ?? magicPayFlow ?? nexusPayFlow;
  if (!flow) return;
  const spec = step === 'payment' ? flow.paySpec : (flow.placeSpec ?? flow.paySpec);
  const paySpec = flow.paySpec;

  function soulAvail(zoneHasSoul, payUsedSoul) {
    return step === 'payment' ? zoneHasSoul : (zoneHasSoul && !payUsedSoul);
  }

  if (zone === 'reserve') {
    if (!soulAvail(player.reserve.soul, paySpec.reserve?.soul)) return;
    spec.reserve.soul = !spec.reserve.soul;
  } else {
    const sp = player.spirits.find(s => s.uid === zone);
    if (sp) {
      if (!soulAvail(sp.cores.soul, paySpec.spirits?.[zone]?.soul)) return;
      if (!spec.spirits[zone]) spec.spirits[zone] = { normal: 0, soul: false };
      spec.spirits[zone].soul = !spec.spirits[zone].soul;
    } else {
      const nx = player.nexuses.find(n => n.uid === zone);
      if (nx) {
        if (!soulAvail(nx.cores.soul, paySpec.nexuses?.[zone]?.soul)) return;
        if (!spec.nexuses[zone]) spec.nexuses[zone] = { normal: 0, soul: false };
        spec.nexuses[zone].soul = !spec.nexuses[zone].soul;
      }
    }
  }
  renderModals(game?.getState());
}

function _sfZoneRows(_player, zones, spec, step) {
  // zones = { reserve:{normal,soul}, spirits:[{uid,name,normal,soul}], nexuses:[{uid,name,normal,soul}] }
  let html = '';
  const MAX_ICONS = 8;
  const glowColor = step === 'placement' ? 'rgba(74,222,128,0.8)' : 'rgba(251,146,60,0.8)';

  function row(label, labelClass, uid, avail, sel) {
    const hasNormal = avail.normal > 0;
    const hasSoul = avail.soul;
    const selN = sel.normal ?? 0;
    const selSoul = sel.soul ?? false;
    if (!hasNormal && !hasSoul) {
      return `<div class="flex items-center justify-between py-2 border-b border-gray-800/50">
        <span class="${labelClass} text-sm">${label}</span>
        <span class="text-gray-600 text-xs">−</span>
      </div>`;
    }

    let coresHtml = '';
    if (hasNormal) {
      if (avail.normal <= MAX_ICONS) {
        // Individual clickable core icons — bright = selected/paying, dim = available
        for (let i = 0; i < avail.normal; i++) {
          const paying = i < selN;
          const dir = paying ? '-1' : '1';
          const imgStyle = paying
            ? `width:22px;height:22px;display:block;filter:drop-shadow(0 0 4px ${glowColor})`
            : 'width:22px;height:22px;display:block';
          coresHtml += `<button data-sf-adj="${uid}" data-sf-step="${step}" data-sf-dir="${dir}"
            class="p-0 border-0 bg-transparent cursor-pointer transition-all" style="line-height:0" title="${paying ? 'Remove' : 'Add'}">
            <img src="${CORE_ICON}" style="${imgStyle}" class="${paying ? 'opacity-100' : 'opacity-20 hover:opacity-50'}" />
          </button>`;
        }
      } else {
        // Overflow: −/+ buttons with core icon and count
        coresHtml += `
          <button data-sf-adj="${uid}" data-sf-step="${step}" data-sf-dir="-1"
            class="w-7 h-7 rounded-full bg-gray-800 text-white text-base flex items-center justify-center transition-colors ${selN <= 0 ? 'opacity-20 pointer-events-none' : 'hover:bg-gray-700'}">−</button>
          <div class="flex items-center gap-0.5 mx-0.5">
            <img src="${CORE_ICON}" style="width:18px;height:18px" class="${selN > 0 ? 'opacity-100' : 'opacity-25'}" />
            <span class="text-white font-bold font-mono text-sm min-w-[1.2ch] text-center">${selN}</span>
            <span class="text-gray-600 text-xs">/</span>
            <span class="text-gray-400 text-xs">${avail.normal}</span>
          </div>
          <button data-sf-adj="${uid}" data-sf-step="${step}" data-sf-dir="1"
            class="w-7 h-7 rounded-full bg-gray-800 text-white text-base flex items-center justify-center transition-colors ${selN >= avail.normal ? 'opacity-20 pointer-events-none' : 'hover:bg-gray-700'}">+</button>`;
      }
    }

    let soulHtml = '';
    if (hasSoul) {
      const scStyle = selSoul
        ? 'width:22px;height:22px;display:block;filter:drop-shadow(0 0 5px rgba(250,204,21,0.9))'
        : 'width:22px;height:22px;display:block';
      soulHtml = `<button data-sf-soul="${uid}" data-sf-step="${step}"
        class="p-0 border-0 bg-transparent cursor-pointer transition-all ml-1" style="line-height:0" title="${selSoul ? 'Remove SC' : 'Add SC'}">
        <img src="${SOUL_CORE_ICON}" style="${scStyle}"
          class="${selSoul ? 'opacity-100' : 'opacity-20 hover:opacity-50'}" />
      </button>`;
    }

    return `<div class="flex items-center justify-between py-2 border-b border-gray-800/50">
      <span class="${labelClass} text-sm max-w-[130px] truncate">${label}</span>
      <div class="flex items-center gap-1 flex-wrap justify-end">
        ${coresHtml}${soulHtml}
      </div>
    </div>`;
  }

  html += row('Reserve', 'text-gray-200 font-medium', 'reserve', zones.reserve, spec.reserve);
  for (const sp of zones.spirits) {
    html += row(sp.name, 'text-orange-300', sp.uid, { normal: sp.normal, soul: sp.soul }, spec.spirits[sp.uid] ?? { normal: 0, soul: false });
  }
  for (const nx of zones.nexuses) {
    html += row(nx.name, 'text-green-400', nx.uid, { normal: nx.normal, soul: nx.soul }, spec.nexuses[nx.uid] ?? { normal: 0, soul: false });
  }
  return html;
}

function _sfAvailableZones(player, paySpec) {
  return {
    reserve: {
      normal: player.reserve.normal - (paySpec.reserve?.normal ?? 0),
      soul: player.reserve.soul && !(paySpec.reserve?.soul),
    },
    spirits: player.spirits.map(s => ({
      uid: s.uid, name: s.name,
      normal: s.cores.normal - (paySpec.spirits?.[s.uid]?.normal ?? 0),
      soul: s.cores.soul && !(paySpec.spirits?.[s.uid]?.soul),
    })),
    nexuses: player.nexuses.map(n => ({
      uid: n.uid, name: n.name,
      normal: n.cores.normal - (paySpec.nexuses?.[n.uid]?.normal ?? 0),
      soul: n.cores.soul && !(paySpec.nexuses?.[n.uid]?.soul),
    })),
  };
}

function renderSummonFlowModal(player) {
  const { step, card, baseCost, reduction, actualCost, lv1Min, paySpec, placeSpec, legacyAvailable, legacyBanishCount } = summonFlow;
  const COLOR = COLOR_CSS[card.color] ?? '#f97316';
  const finalCost = Math.max(0, actualCost - legacyBanishCount);

  if (step === 'payment') {
    const zones = {
      reserve: { normal: player.reserve.normal, soul: player.reserve.soul },
      spirits: player.spirits.map(s => ({ uid: s.uid, name: s.name, normal: s.cores.normal, soul: s.cores.soul })),
      nexuses: player.nexuses.map(n => ({ uid: n.uid, name: n.name, normal: n.cores.normal, soul: n.cores.soul })),
    };
    const total = _sfSpecTotal(paySpec);
    const ready = total === finalCost;
    const maxBanish = Math.min(legacyAvailable, actualCost);
    let costLine = `Cost <b>${baseCost}</b>`;
    if (reduction > 0) costLine += ` − Symbols <b>${reduction}</b>`;
    if (legacyBanishCount > 0) costLine += ` − Legacy <b>${legacyBanishCount}</b>`;
    costLine += ` = Pay <b>${finalCost}</b>`;
    const legacyRow = legacyAvailable > 0 ? `
      <div class="flex items-center justify-between py-1.5 border-b border-gray-800/50">
        <span class="text-purple-400 text-sm font-medium">Legacy Banish <span class="text-gray-500 font-normal text-xs">(EX from Trash)</span></span>
        <div class="flex items-center gap-1.5">
          <span class="text-gray-500 text-xs">×${legacyAvailable}</span>
          <button id="sf-legacy-dec" class="w-6 h-6 rounded bg-gray-700 text-white text-sm flex items-center justify-center ${legacyBanishCount <= 0 ? 'opacity-25 pointer-events-none' : 'hover:bg-gray-600'}">−</button>
          <span class="w-5 text-center text-white font-mono text-sm font-bold">${legacyBanishCount}</span>
          <button id="sf-legacy-inc" class="w-6 h-6 rounded bg-gray-700 text-white text-sm flex items-center justify-center ${legacyBanishCount >= maxBanish ? 'opacity-25 pointer-events-none' : 'hover:bg-gray-600'}">+</button>
        </div>
      </div>` : '';
    return `
      <div class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3">
        <div class="w-full max-w-sm rounded-2xl border border-gray-700 bg-gray-950 shadow-2xl flex flex-col" style="max-height:88vh">
          <div class="flex items-start justify-between p-4 pb-2">
            <div>
              <h2 class="text-white font-bold text-base">${card.name}</h2>
              <p class="text-xs mt-0.5" style="color:${COLOR}">${costLine}</p>
            </div>
            <button id="sf-cancel" class="ml-3 w-7 h-7 rounded-full bg-gray-800 text-gray-400 text-sm hover:text-white flex items-center justify-center flex-shrink-0">✕</button>
          </div>
          <div class="px-4 pb-1 flex items-center justify-between">
            <span class="text-xs text-gray-400 font-semibold uppercase tracking-wide">Step 1 / 2 — Payment</span>
            <span class="text-sm font-bold ${ready ? 'text-green-400' : 'text-gray-300'}">${total} / ${finalCost}</span>
          </div>
          <div class="px-4 overflow-y-auto flex-1 min-h-0">
            ${legacyRow}
            ${_sfZoneRows(player, zones, paySpec, 'payment')}
          </div>
          <div class="p-4 pt-3">
            <button id="sf-next" class="w-full py-2 rounded-lg font-semibold text-sm transition-colors ${ready ? 'bg-orange-600 text-white hover:bg-orange-500' : 'bg-gray-700 text-gray-500 pointer-events-none'}">
              Next: Place Cores →
            </button>
          </div>
        </div>
      </div>`;
  }

  // Placement step
  const afterPayZones = _sfAvailableZones(player, paySpec);
  const total = _sfSpecTotal(placeSpec);
  const ready = total >= lv1Min;
  return `
    <div class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3">
      <div class="w-full max-w-sm rounded-2xl border border-gray-700 bg-gray-950 shadow-2xl flex flex-col" style="max-height:88vh">
        <div class="flex items-start justify-between p-4 pb-2">
          <div>
            <h2 class="text-white font-bold text-base">${card.name}</h2>
            <p class="text-xs text-gray-400 mt-0.5">Place cores on spirit (LV1 needs <b class="text-orange-400">${lv1Min}</b>)</p>
          </div>
          <button id="sf-cancel" class="ml-3 w-7 h-7 rounded-full bg-gray-800 text-gray-400 text-sm hover:text-white flex items-center justify-center flex-shrink-0">✕</button>
        </div>
        <div class="px-4 pb-1 flex items-center justify-between">
          <span class="text-xs text-gray-400 font-semibold uppercase tracking-wide">Step 2 / 2 — Placement</span>
          <span class="text-sm font-bold ${ready ? 'text-green-400' : 'text-gray-300'}">${total} / min ${lv1Min}</span>
        </div>
        <div class="px-4 overflow-y-auto flex-1 min-h-0">
          ${_sfZoneRows(player, afterPayZones, placeSpec, 'placement')}
        </div>
        <div class="p-4 pt-3 flex gap-2">
          <button id="sf-back" class="flex-none px-4 py-2 rounded-lg bg-gray-700 text-gray-300 text-sm hover:bg-gray-600 transition-colors">← Back</button>
          <button id="sf-confirm" class="flex-1 py-2 rounded-lg font-semibold text-sm transition-colors ${ready ? 'bg-orange-600 text-white hover:bg-orange-500' : 'bg-gray-700 text-gray-500 pointer-events-none'}">
            Summon!
          </button>
        </div>
      </div>
    </div>`;
}

function renderDeckRevealModal(eff, isHuman) {
  const cardsHtml = eff.revealed.map(id => {
    const card = CARD_POOL[id];
    const toHand = eff.toHand.includes(id);
    const toTrash = eff.toTrash?.includes(id);
    const ringClass = toHand ? 'ring-2 ring-green-400' : toTrash ? 'ring-1 ring-red-600 opacity-70' : 'ring-1 ring-gray-600 opacity-70';
    const nameClass = toHand ? 'text-green-300 font-medium' : toTrash ? 'text-red-400' : 'text-gray-400';
    const badgeClass = toHand ? 'bg-green-900 text-green-300' : toTrash ? 'bg-red-900 text-red-400' : 'bg-gray-800 text-gray-500';
    const badgeText = toHand ? '→ Hand' : toTrash ? '→ Trash' : '↩ Deck';
    return `
      <div class="flex flex-col items-center gap-1.5">
        <img src="${card?.image ?? './assets/BS_back.webp'}" alt="${card?.name ?? id}"
             class="rounded-lg object-cover shadow-lg ${ringClass}"
             style="width:72px;height:100px">
        <span class="text-xs text-center max-w-[80px] leading-tight ${nameClass}">${card?.name ?? id}</span>
        <span class="text-xs px-2 py-0.5 rounded-full font-bold ${badgeClass}">${badgeText}</span>
      </div>`;
  }).join('');
  const parts = [];
  if (eff.toHand.length > 0) parts.push(`${eff.toHand.length} card(s) → Hand`);
  if (eff.toBottom?.length > 0) parts.push(`${eff.toBottom.length} ↩ Deck`);
  if (eff.toTrash?.length > 0) parts.push(`${eff.toTrash.length} → Trash`);
  const summary = parts.length > 0 ? parts.join(', ') : 'Nothing added';
  return `
    <div class="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3">
      <div class="w-full max-w-sm rounded-2xl border border-gray-700 bg-gray-950 shadow-2xl p-4 flex flex-col gap-4">
        <div class="text-center">
          <h2 class="text-white font-bold text-base">${eff.sourceName ?? 'Reveal'}</h2>
          <p class="text-xs text-gray-400 mt-0.5">Revealed ${eff.revealed.length} card(s) from deck top</p>
        </div>
        <div class="flex gap-3 justify-center flex-wrap">${cardsHtml}</div>
        <p class="text-xs text-center text-gray-300">${summary}</p>
        ${isHuman
          ? `<button id="deck-reveal-confirm" class="w-full py-2 rounded-lg bg-blue-600 text-white font-semibold text-sm hover:bg-blue-500 transition-colors">Confirm</button>`
          : `<p class="text-xs text-center text-gray-500 italic">AI resolving...</p>`}
      </div>
    </div>`;
}

function renderMagicEffectChoiceModal() {
  const { card } = magicEffectChoice;
  const mainEff = card.effects?.find(e => e.condition === "Main");
  const flashEff = card.effects?.find(e => e.condition === "Flash");
  return `
    <div class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3">
      <div class="w-full max-w-sm rounded-2xl border border-gray-700 bg-gray-950 shadow-2xl p-4 flex flex-col gap-3">
        <div class="flex items-center justify-between">
          <h2 class="text-white font-bold text-base">${card.name}</h2>
          <button id="mec-cancel" class="w-7 h-7 rounded-full bg-gray-800 text-gray-400 text-sm hover:text-white flex items-center justify-center">✕</button>
        </div>
        <p class="text-xs text-gray-400">Choose which effect to activate:</p>
        <button id="mec-main" class="w-full px-3 py-3 rounded-xl bg-purple-900 hover:bg-purple-800 text-white text-sm text-left transition-colors">
          <span class="font-bold text-purple-300">Main — </span>${mainEff?.text ?? ''}
        </button>
        <button id="mec-flash" class="w-full px-3 py-3 rounded-xl bg-indigo-900 hover:bg-indigo-800 text-white text-sm text-left transition-colors">
          <span class="font-bold text-indigo-300">Flash — </span>${flashEff?.text ?? ''}
        </button>
      </div>
    </div>`;
}

function openMagicPayFlow(handIndex, context) {
  if (context === 'flashWindow') {
    const v = game.canPlayFlashMagic(handIndex);
    if (!v.ok) return;
    if (v.isSoulMagic || v.actualCost === 0) {
      _showCardReveal(v.card);
      const cardColor = COLOR_CSS[v.card.color] ?? "#a855f7";
      if (v.isSoulMagic) {
        showBannerSequence([
          { text: "◆ Soul Magic", color: cardColor },
          { text: v.card.name, color: cardColor },
        ]);
      } else {
        _pendingActionLabel = { text: `Magic: ${v.card.name}`, color: cardColor };
      }
      game.playFlashMagic(handIndex);
      if (!_tryAutoPassFlash()) { render(); runAiTurnLoop(); }
      return;
    }
    magicPayFlow = { context, handIndex, card: v.card, baseCost: v.card.cost, actualCost: v.actualCost, paySpec: _sfEmptySpec() };
  } else {
    const v = game.canPlayMagic(handIndex);
    if (!v.ok) return;
    if (v.actualCost === 0) {
      _showCardReveal(v.card);
      _pendingActionLabel = { text: `Magic: ${v.card.name}`, color: "#a855f7" };
      game.playMagic(handIndex, null, context === 'mainFlash');
      render(); runAiTurnLoop();
      return;
    }
    magicPayFlow = { context, handIndex, card: v.card, baseCost: v.card.cost, actualCost: v.actualCost, paySpec: _sfEmptySpec() };
  }
  cardDetailId = null; cardDetailIndex = null;
  renderModals(game?.getState());
}

function renderMagicPayModal(player) {
  const { card, baseCost, actualCost, paySpec, context } = magicPayFlow;
  const COLOR = COLOR_CSS[card.color] ?? '#a855f7';
  const reduction = baseCost - actualCost;
  const total = _sfSpecTotal(paySpec);
  const ready = total === actualCost;
  const isFlashWindow = context === 'flashWindow';
  const effectLabel = context === 'mainFlash' ? 'Flash' : 'Main';

  let costLine = `Cost <b>${baseCost}</b>`;
  if (reduction > 0) costLine += ` − Symbols <b>${reduction}</b>`;
  costLine += ` = Pay <b>${actualCost}</b>`;

  const zones = {
    reserve: { normal: player.reserve.normal, soul: player.reserve.soul },
    spirits: player.spirits.map(s => ({ uid: s.uid, name: s.name, normal: s.cores.normal, soul: s.cores.soul })),
    nexuses: player.nexuses.map(n => ({ uid: n.uid, name: n.name, normal: n.cores.normal, soul: n.cores.soul })),
  };
  const tagLabel = isFlashWindow
    ? `<span class="text-xs px-2 py-0.5 rounded-full bg-yellow-900 text-yellow-300 font-bold ml-2">Flash Window</span>`
    : `<span class="text-xs px-2 py-0.5 rounded-full bg-purple-900 text-purple-300 font-bold ml-2">${effectLabel}</span>`;

  return `
    <div class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3">
      <div class="w-full max-w-sm rounded-2xl border border-gray-700 bg-gray-950 shadow-2xl flex flex-col" style="max-height:88vh">
        <div class="flex items-start justify-between p-4 pb-2">
          <div>
            <div class="flex items-center flex-wrap gap-1">
              <h2 class="text-white font-bold text-base">${card.name}</h2>
              ${tagLabel}
            </div>
            <p class="text-xs mt-0.5" style="color:${COLOR}">${costLine}</p>
          </div>
          <button id="mpf-cancel" class="ml-3 w-7 h-7 rounded-full bg-gray-800 text-gray-400 text-sm hover:text-white flex items-center justify-center flex-shrink-0">✕</button>
        </div>
        <div class="px-4 pb-1 flex items-center justify-between">
          <span class="text-xs text-gray-400 font-semibold uppercase tracking-wide">Payment</span>
          <span class="text-sm font-bold ${ready ? 'text-green-400' : 'text-gray-300'}">${total} / ${actualCost}</span>
        </div>
        <div class="px-4 overflow-y-auto flex-1 min-h-0">
          ${_sfZoneRows(player, zones, paySpec, 'payment')}
        </div>
        <div class="p-4 pt-3">
          <button id="mpf-confirm" class="w-full py-2 rounded-lg font-semibold text-sm transition-colors ${ready ? 'bg-purple-600 text-white hover:bg-purple-500' : 'bg-gray-700 text-gray-500 pointer-events-none'}">
            Play Magic!
          </button>
        </div>
      </div>
    </div>`;
}

function openNexusPayFlow(handIndex) {
  const v = game.canDeploy(handIndex);
  if (!v.ok) return;
  if (v.actualCost === 0) {
    const card = v.card;
    _showCardReveal(card);
    _pendingActionLabel = { text: `Deploy: ${card.name}`, color: COLOR_CSS[card.color] ?? '#22c55e' };
    game.deployNexus(handIndex, null);
    render(); runAiTurnLoop();
    return;
  }
  nexusPayFlow = { handIndex, card: v.card, baseCost: v.card.cost, actualCost: v.actualCost, paySpec: _sfEmptySpec() };
  cardDetailId = null; cardDetailIndex = null;
  renderModals(game?.getState());
}

function renderNexusPayModal(player) {
  const { card, baseCost, actualCost, paySpec } = nexusPayFlow;
  const COLOR = COLOR_CSS[card.color] ?? '#22c55e';
  const reduction = baseCost - actualCost;
  const total = _sfSpecTotal(paySpec);
  const ready = total === actualCost;

  let costLine = `Cost <b>${baseCost}</b>`;
  if (reduction > 0) costLine += ` − Symbols <b>${reduction}</b>`;
  costLine += ` = Pay <b>${actualCost}</b>`;

  const zones = {
    reserve: { normal: player.reserve.normal, soul: player.reserve.soul },
    spirits: player.spirits.map(s => ({ uid: s.uid, name: s.name, normal: s.cores.normal, soul: s.cores.soul })),
    nexuses: player.nexuses.map(n => ({ uid: n.uid, name: n.name, normal: n.cores.normal, soul: n.cores.soul })),
  };

  return `
    <div class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3">
      <div class="w-full max-w-sm rounded-2xl border border-gray-700 bg-gray-950 shadow-2xl flex flex-col" style="max-height:88vh">
        <div class="flex items-start justify-between p-4 pb-2">
          <div>
            <div class="flex items-center flex-wrap gap-1">
              <h2 class="text-white font-bold text-base">${card.name}</h2>
              <span class="text-xs px-2 py-0.5 rounded-full bg-green-900 text-green-300 font-bold ml-2">Deploy</span>
            </div>
            <p class="text-xs mt-0.5" style="color:${COLOR}">${costLine}</p>
          </div>
          <button id="npf-cancel" class="ml-3 w-7 h-7 rounded-full bg-gray-800 text-gray-400 text-sm hover:text-white flex items-center justify-center flex-shrink-0">✕</button>
        </div>
        <div class="px-4 pb-1 flex items-center justify-between">
          <span class="text-xs text-gray-400 font-semibold uppercase tracking-wide">Payment</span>
          <span class="text-sm font-bold ${ready ? 'text-green-400' : 'text-gray-300'}">${total} / ${actualCost}</span>
        </div>
        <div class="px-4 overflow-y-auto flex-1 min-h-0">
          ${_sfZoneRows(player, zones, paySpec, 'payment')}
        </div>
        <div class="p-4 pt-3">
          <button id="npf-confirm" class="w-full py-2 rounded-lg font-semibold text-sm transition-colors ${ready ? 'bg-green-600 text-white hover:bg-green-500' : 'bg-gray-700 text-gray-500 pointer-events-none'}">
            Deploy Nexus!
          </button>
        </div>
      </div>
    </div>`;
}

function clickDeploy(index) {
  openNexusPayFlow(index);
}

function clickPlayMagic(index) {
  const cardId = game.getState().players[0].hand[index];
  const card = CARD_POOL[cardId];
  const hasMain = card?.effects?.some(e => e.condition === "Main");
  const hasFlash = card?.effects?.some(e => e.condition === "Flash");
  if (hasMain && hasFlash) {
    cardDetailId = null; cardDetailIndex = null;
    magicEffectChoice = { handIndex: index, card };
    renderModals(game?.getState());
    return;
  }
  openMagicPayFlow(index, 'main');
}

function clickAttack(uid) {
  const spirit = game.getState().players[0].spirits.find((s) => s.uid === uid);
  if (spirit) _pendingActionLabel = { text: `${spirit.name} attacks!`, color: "#ff8c42" };
  game.declareAttack(uid, aiBlockChooser); render(); runAiTurnLoop();
}

function clickBlock(uidOrNull) {
  game.defendWith(uidOrNull); render(); runAiTurnLoop();
}

function clickNextPhase() {
  game.nextPhase(); render(); runAiTurnLoop();
}

// After a flash action resolves, auto-pass if human has no remaining flash options.
// Returns true if auto-passed (caller should not call render/runAiTurnLoop).
function _tryAutoPassFlash() {
  const state = game.getState();
  if (!state.awaitingFlash || state.awaitingEffect) return false;
  const you = state.players[0];
  const { attackerUid } = state.awaitingFlash;
  const isHumanAttacking = state.currentPlayer === 0;
  const hasFlashMagic = you.hand.some((_, idx) => game.canPlayFlashMagic(idx).ok);
  const hasInvokeFlash = isHumanAttacking && game.canInvokeFlash(attackerUid).ok;
  const hasAnyAttackStepFlash = isHumanAttacking && you.spirits.some(s => s.uid !== attackerUid && game.canInvokeFlash(s.uid).ok);
  const hasNexusFlash = isHumanAttacking && you.nexuses.some(n => game.canInvokeNexusFlash(n.uid).ok);
  if (hasFlashMagic || hasInvokeFlash || hasAnyAttackStepFlash || hasNexusFlash) return false;
  game.passFlash();
  render();
  runAiTurnLoop();
  return true;
}

function clickResolveEffect(targetUid) {
  // Handle multi-select card effects
  const state = game?.getState();
  if (state?.awaitingEffect) {
    const eff = state.awaitingEffect;
    const isMultiSelect = ["feedingDrawReturnCards", "menhirCircleSelectCards", "rockDrillingSelectCards", "nestlingSelectCards", "emeraldAbyssInvokeMain"].includes(eff.type);
    
    if (isMultiSelect && targetUid !== "skip" && targetUid !== "submit") {
      const maxSelect = eff.type === "feedingDrawReturnCards" ? 2 :
                       eff.type === "menhirCircleSelectCards" ? 2 :
                       eff.type === "rockDrillingSelectCards" ? 3 :
                       eff.type === "emeraldAbyssInvokeMain" ? 1 : 2;
      
      if (!multiSelectCards) {
        multiSelectCards = { selectedCards: [], maxSelect };
      }
      
      // Toggle card selection
      const idx = multiSelectCards.selectedCards.indexOf(targetUid);
      if (idx >= 0) {
        multiSelectCards.selectedCards.splice(idx, 1);
      } else if (multiSelectCards.selectedCards.length < maxSelect) {
        multiSelectCards.selectedCards.push(targetUid);
      }
      
      render();
      return;
    }
    
    // Handle submit for multi-select
    if (targetUid === "submit" && multiSelectCards && multiSelectCards.selectedCards.length > 0) {
      const selected = multiSelectCards.selectedCards;
      multiSelectCards = null;
      game.resolveEffect(selected, aiBlockChooser);
      if (!_tryAutoPassFlash()) { render(); runAiTurnLoop(); }
      return;
    }
  }
  
  // Handle final submission or normal single-select
  if (multiSelectCards && multiSelectCards.selectedCards.length > 0) {
    const selected = multiSelectCards.selectedCards;
    multiSelectCards = null;
    game.resolveEffect(selected, aiBlockChooser);
  } else {
    multiSelectCards = null;
    game.resolveEffect(targetUid, aiBlockChooser);
  }
  
  if (!_tryAutoPassFlash()) { render(); runAiTurnLoop(); }
}

function clickMoveCore(fromType, fromUid, toType, toUid, isSoul) {
  game.moveCore(fromType, fromUid, toType, toUid, isSoul); render();
}

function clickPassFlash() {
  game.passFlash(); render(); runAiTurnLoop();
}

function clickPlayFlashMagic(index) {
  openMagicPayFlow(index, 'flashWindow');
}

function clickFlashSummon(index) {
  const idx = Number(index);
  if (Number.isNaN(idx)) return;
  const res = game.flashSummon(idx);
  render();
  // If flash window continues, don't run AI loop; otherwise continue
  if (!_tryAutoPassFlash()) { runAiTurnLoop(); }
}

function clickInvokeMain(uid) {
  game.invokeMain(uid);
  render(); runAiTurnLoop();
}

function clickInvokeNexusMain(uid) {
  game.invokeNexusMain(uid);
  render(); runAiTurnLoop();
}

function clickInvokeFlash(uid) {
  const spirit = game.getState().players.flatMap((p) => p.spirits).find((s) => s.uid === uid);
  if (spirit) _showKeywordBanner(spirit.cardId);
  game.invokeFlash(uid);
  if (!_tryAutoPassFlash()) { render(); runAiTurnLoop(); }
}

function clickInvokeNexusFlash(uid) {
  const nexus = game.getState().players.flatMap((p) => p.nexuses ?? []).find((n) => n.uid === uid);
  if (nexus) _showKeywordBanner(nexus.cardId);
  game.invokeNexusFlash(uid);
  if (!_tryAutoPassFlash()) { render(); runAiTurnLoop(); }
}

// ─── Render helpers ──────────────────────────────────────────────────────────

function renderCoreIcons(normalCount, hasSoul, maxIcons = 10) {
  let html = "";
  const shown = Math.min(normalCount, maxIcons);
  for (let i = 0; i < shown; i++) html += `<img class="core-icon" src="${CORE_ICON}" alt="core" />`;
  if (normalCount > maxIcons) html += `<span class="core-overflow">+${normalCount - maxIcons}</span>`;
  if (hasSoul) html += `<img class="core-icon soul" src="${SOUL_CORE_ICON}" alt="soul core" />`;
  return html || "<span class='core-empty'>-</span>";
}

function renderLifeDots(life) {
  let html = "";
  for (let i = 0; i < 5; i++) {
    html += i < life
      ? `<img class="core-icon life" src="${CORE_ICON}" alt="life" />`
      : `<span class="life-dot off"></span>`;
  }
  return html;
}

function renderTurnSequence(phase) {
  const labels = ["Start", "Core", "Draw", "Refresh", "Main", "Attack", "Main2", "End"];
  const activeMap = { MAIN: "Main", ATTACK: "Attack", MAIN2: "Main2" };
  return `<ol class="turn-seq-list" style="display: flex; gap: 8px; list-style: none; margin: 0; padding: 0;">${labels.map((l) =>
    `<li class="${activeMap[phase] === l ? "active" : ""}" style="font-size: 9px; padding: 2px 4px; border: 1px solid #555; border-radius: 3px; ${activeMap[phase] === l ? "background: #444; border-color: #aaa;" : ""}">${l}</li>`).join("")}</ol>`;
}

// ─── Field / lane rendering ───────────────────────────────────────────────────

function renderSpiritLane(player, state, isBottomLane) {
  const isActive = state.currentPlayer === player.id;
  const isHumanTurn = isActive && !player.isAi;
  const inMain = state.phase === PHASES.MAIN || state.phase === PHASES.MAIN2;

  const nexuses = (player.nexuses ?? []).map((n) => {
    const card = CARD_POOL[n.cardId];
    const level = getCardLevel(n, card);
    const thumb = card?.image
      ? `<img class="spirit-thumb cursor-pointer" data-card-detail="${n.cardId}" src="${card.image}" alt="${n.name}" loading="lazy" />`
      : `<div class="spirit-thumb spirit-thumb-fallback cursor-pointer" data-card-detail="${n.cardId}">${n.name.slice(0, 2).toUpperCase()}</div>`;
    const coreBtns = isBottomLane && isHumanTurn && inMain ? `
      <div class="core-btns">
        ${player.reserve.normal > 0 ? `<button data-mv="reserve,,nexus,${n.uid},0" class="mini core-btn">+</button>` : ""}
        ${n.cores.normal > 0 ? `<button data-mv="nexus,${n.uid},reserve,,0" class="mini core-btn">−</button>` : ""}
        ${player.reserve.soul && !n.cores.soul ? `<button data-mv="reserve,,nexus,${n.uid},1" class="mini core-btn sc">SC+</button>` : ""}
        ${n.cores.soul ? `<button data-mv="nexus,${n.uid},reserve,,1" class="mini core-btn sc">SC−</button>` : ""}
      </div>` : "";
    const nexusInvokeMainBtn = isBottomLane && isHumanTurn && inMain && game.canInvokeNexusMain(n.uid).ok
      ? `<button data-invoke-nexus-main="${n.uid}" class="mini invoke-btn">Invoke</button>` : "";
    const nExClass = n.exhausted
      ? `exhausted${prevExhausted.has(n.uid) ? "" : " exhausted-new"}` : "";
    return `<li class="spirit-slot" data-uid="${n.uid}">
      <div class="spirit-chip ${nExClass}">
        ${thumb}
        <button class="card-info-btn" data-card-detail="${n.cardId}">ℹ</button>
        <div class="spirit-overlay">
          <div class="title">${n.name}</div>
          <div class="meta lv${level}">LV${level} | NEXUS</div>
          <div class="core-strip">${renderCoreIcons(n.cores.normal, n.cores.soul, 6)}</div>
          ${coreBtns}${nexusInvokeMainBtn}
        </div>
      </div></li>`;
  }).join("");

  const spirits = player.spirits.map((s) => {
    const card = CARD_POOL[s.cardId];
    const level = getCardLevel(s, card);
    const bp = getEffectiveBP(s, card);
    const attackBtn = isBottomLane && isHumanTurn && state.phase === PHASES.ATTACK
      && !s.exhausted && !state.awaitingFlash && !state.awaitingBlock && !state.awaitingEffect
      ? `<button data-attack="${s.uid}" class="mini">Attack</button>` : "";
    const invokeMainBtn = isBottomLane && isHumanTurn && inMain && game.canInvokeMain(s.uid).ok
      ? `<button data-invoke-main="${s.uid}" class="mini invoke-btn">Invoke</button>` : "";
    const coreBtns = isBottomLane && isHumanTurn && inMain ? `
      <div class="core-btns">
        ${player.reserve.normal > 0 ? `<button data-mv="reserve,,spirit,${s.uid},0" class="mini core-btn">+</button>` : ""}
        ${s.cores.normal > 1 || (s.cores.normal > 0 && s.cores.soul) ? `<button data-mv="spirit,${s.uid},reserve,,0" class="mini core-btn">−</button>` : ""}
        ${player.reserve.soul && !s.cores.soul ? `<button data-mv="reserve,,spirit,${s.uid},1" class="mini core-btn sc">SC+</button>` : ""}
        ${s.cores.soul ? `<button data-mv="spirit,${s.uid},reserve,,1" class="mini core-btn sc">SC−</button>` : ""}
      </div>` : "";
    const thumb = card?.image
      ? `<img class="spirit-thumb cursor-pointer" data-card-detail="${s.cardId}" src="${card.image}" alt="${s.name}" loading="lazy" />`
      : `<div class="spirit-thumb spirit-thumb-fallback cursor-pointer" data-card-detail="${s.cardId}">${s.name.slice(0, 2).toUpperCase()}</div>`;
    const sExClass = s.exhausted
      ? `exhausted${prevExhausted.has(s.uid) ? "" : " exhausted-new"}` : "";
    return `<li class="spirit-slot" data-uid="${s.uid}">
      <div class="spirit-chip ${sExClass}">
        ${thumb}
        <button class="card-info-btn" data-card-detail="${s.cardId}">ℹ</button>
        <div class="spirit-overlay">
          <div class="title">${s.name}</div>
          <div class="meta lv${level}">LV${level} | ${bp} BP</div>
          <div class="core-strip">${renderCoreIcons(s.cores.normal, s.cores.soul, 6)}</div>
          ${coreBtns}${attackBtn}${invokeMainBtn}
        </div>
      </div></li>`;
  }).join("");

  const blockPanel = "";

  return `<section class="lane ${isActive ? "active" : ""}">
    <header>
      <h3>${player.name}</h3>
      <div class="stats compact">
        <span>Life ${player.life}</span>
        <span>Deck ${player.deck.length}</span>
        <span>Hand ${player.hand.length}</span>
        <span>Reserve ${player.reserve.normal + (player.reserve.soul ? 1 : 0)}</span>
        <span>Trash ${player.trash.length}</span>
      </div>
    </header>
 
    <ul class="spirit-lane">${spirits || "<li class='empty'>No spirits</li>"}</ul>
       ${nexuses ? `<ul class="spirit-lane nexus-lane">${nexuses}</ul>` : ""}
    ${blockPanel}
  </section>`;
}

// ─── Hand rendering ───────────────────────────────────────────────────────────

function renderHand(player, state) {
  const isHumanTurn = state.currentPlayer === player.id && !player.isAi;
  const inMain = state.phase === PHASES.MAIN || state.phase === PHASES.MAIN2;
  const canAct = isHumanTurn && inMain && !state.awaitingEffect;

  const items = player.hand.map((cardId, idx) => {
    const card = CARD_POOL[cardId];
    const isNexus = card?.type === "nexus";
    const isMagic = card?.type === "magic";
    const isSpirit = card?.type === "spirit";

    let actionBtns = "";
    if (canAct) {
      if (isSpirit && game.canSummon(idx).ok) {
        actionBtns = `<button data-summon="${idx}" class="mini">Summon</button>`;
      } else if (isNexus && game.canDeploy(idx).ok) {
        actionBtns = `<button data-deploy="${idx}" class="mini">Deploy</button>`;
      } else if (isMagic && game.canPlayMagic(idx).ok) {
        actionBtns = `<button data-magic="${idx}" class="mini magic-btn">Play</button>`;
      }
    }

    const thumb = card?.image
      ? `<img class="hand-thumb cursor-pointer" data-card-detail="${cardId}" data-card-index="${idx}" src="${card.image}" alt="${card.name}" loading="lazy" />`
      : `<div class="hand-thumb hand-thumb-fallback cursor-pointer" data-card-detail="${cardId}" data-card-index="${idx}">${(card?.name ?? "?").slice(0, 2).toUpperCase()}</div>`;
    const effect = card?.effects?.[0]
      ? `<div class="hand-effect"><span>${card.effects[0].condition}</span> ${card.effects[0].text}</div>` : "";
    const title = card ? `${card.name}${card.jpName ? ` (${card.jpName})` : ""}` : "Unknown";
    const meta = card ? `${card.type.toUpperCase()} | C${card.cost} R${card.reduction}${card.bp ? ` | BP ${card.bp}` : ""}` : "";

    return `<li class="hand-card">
      ${thumb}
      <div class="hand-main">
        <div class="row actions">${actionBtns}</div>
      </div></li>`;
  }).join("");

  return `<section class="panel hand-panel">
    <ul class="hand-list">${items || "<li>Empty hand</li>"}</ul>
  </section>`;
}

function renderAiHand(player) {
  const backs = player.hand.map(() =>
    `<li class="ai-hand-card"><img src="./assets/BS_back.webp" alt="" class="ai-card-back"></li>`
  ).join("");
  return `<section class="panel ai-hand-strip">
    <span class="ai-hand-label">AI Hand: ${player.hand.length}</span>
    <ul class="ai-hand-list">${backs || "<li style='color:#555;font-size:11px'>Empty</li>"}</ul>
  </section>`;
}

// ─── Modals ───────────────────────────────────────────────────────────────────

function renderCardDetailModal(cid, idx) {
  const card = CARD_POOL[cid];
  if (!card) return "";
  const thumb = card.image
    ? `<img src="${card.image}" alt="${card.name}" class="w-full object-cover rounded-t-2xl" style="max-height:320px;object-position:top" />`
    : `<div class="w-full h-40 flex items-center justify-center bg-gray-800 rounded-t-2xl text-gray-400 text-3xl font-bold">${card.name.slice(0, 2).toUpperCase()}</div>`;
  const typeColor = card.type === "spirit" ? "text-orange-400 border-orange-400"
    : card.type === "nexus" ? "text-green-400 border-green-400" : "text-purple-400 border-purple-400";
  const effects = (card.effects ?? []).map((e) => `
    <div>
      <p class="text-sky-300 font-bold text-xs uppercase tracking-wide">${e.condition}</p>
      <p class="text-gray-300 text-sm mt-0.5 leading-snug">${e.text}</p>
    </div>`).join("");

  let actionBtns = "";
  if (idx !== null && game) {
    const state = game.getState();
    const you = state.players[0];
    const isHumanTurn = state.currentPlayer === 0 && !you.isAi;
    const inMain = state.phase === PHASES.MAIN || state.phase === PHASES.MAIN2;

    if (isHumanTurn && inMain && card.type === "spirit" && game.canSummon(idx).ok) {
      actionBtns = `<div class="flex flex-wrap gap-2 mt-3">
        <button id="modal-summon" class="w-full px-3 py-2 rounded-lg bg-orange-600 text-white text-sm font-semibold hover:bg-orange-500 transition-colors">Summon</button>
      </div>`;
    } else if (isHumanTurn && inMain && card.type === "nexus" && game.canDeploy(idx).ok) {
      actionBtns = `<div class="flex flex-wrap gap-2 mt-3">
        <button id="modal-deploy" class="w-full px-3 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-500 transition-colors">Deploy</button>
      </div>`;
    } else if (isHumanTurn && inMain && card.type === "magic" && game.canPlayMagic(idx).ok) {
      actionBtns = `<div class="flex flex-wrap gap-2 mt-3">
        <button id="modal-magic" class="w-full px-3 py-2 rounded-lg bg-purple-600 text-white text-sm font-semibold hover:bg-purple-500 transition-colors">Play Magic</button>
      </div>`;
    }
  }

  return `
    <div id="modal-backdrop" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="w-full max-w-xs overflow-hidden rounded-2xl border border-gray-700 bg-gray-950 shadow-2xl">
        <div class="relative">${thumb}
          <button id="modal-close-card" class="absolute right-2 top-2 w-7 h-7 rounded-full bg-black/70 text-white text-sm hover:bg-black flex items-center justify-center">✕</button>
        </div>
        <div class="p-4 space-y-2">
          <div class="flex items-start justify-between gap-2">
            <div>
              <h2 class="text-white font-bold text-base leading-tight">${card.name}</h2>
              ${card.jpName ? `<p class="text-gray-500 text-xs">${card.jpName}</p>` : ""}
            </div>
            <span class="${typeColor} text-xs font-bold uppercase tracking-wide border rounded px-1.5 py-0.5">${card.type}</span>
          </div>
          <div class="flex flex-wrap gap-x-3 gap-y-0.5 text-sm text-gray-400">
            <span>Cost <b class="text-white">${card.cost}</b></span>
            <span>Red <b class="text-white">${card.reduction}</b></span>
            ${card.bp ? `<span>BP <b class="text-white">${card.bp}</b></span>` : ""}
            ${card.family ? `<span class="text-gray-600 w-full text-xs">${card.family}</span>` : ""}
          </div>
          ${card.keyword ? `<p class="text-yellow-400 text-xs font-bold uppercase tracking-wide">◆ ${card.keyword}</p>` : ""}
          ${effects ? `<div class="border-t border-gray-800 pt-2 space-y-2">${effects}</div>` : ""}
          ${actionBtns}
        </div>
      </div>
    </div>`;
}

function renderBlockModal(state) {
  if (!state.awaitingBlock) return "";
  const defender = state.players[state.awaitingBlock.defenderId];
  if (defender.isAi) return "";
  const attacker = [...state.players[0].spirits, ...state.players[1].spirits]
    .find((s) => s.uid === state.awaitingBlock.attackerUid);
  const attackerCard = attacker ? CARD_POOL[attacker.cardId] : null;
  const attackerBp = attacker ? getEffectiveBP(attacker, attackerCard) : 0;

  const blockerBtns = defender.spirits
    .filter((s) => !s.exhausted || s._mustBlock)
    .map((s) => {
      const bp = getEffectiveBP(s, CARD_POOL[s.cardId]);
      const wins = bp >= attackerBp;
      const cls = wins
        ? "border-green-600/60 bg-green-950/60 text-green-100 hover:bg-green-900/60"
        : "border-yellow-700/60 bg-yellow-950/40 text-yellow-100 hover:bg-yellow-900/40";
      const tag = s._mustBlock ? ` <span class="text-orange-400 text-xs">[must]</span>` : "";
      return `<button data-block="${s.uid}" class="px-3 py-1.5 rounded-xl border ${cls} text-sm font-semibold transition-colors">${s.name}${tag} <span class="text-xs opacity-70">${bp} BP</span></button>`;
    }).join("");

  let attackerInfoPanel = "";
  if (blockShowAttackerInfo && attackerCard) {
    const levels = (attackerCard.levels ?? []).map((lv) =>
      `<span class="text-gray-400 text-xs">LV${lv.level} <b class="text-white">${lv.bp.toLocaleString()} BP</b></span>`
    ).join("  ");
    const effects = (attackerCard.effects ?? []).map((e) => `
      <div>
        <p class="text-sky-300 font-bold text-xs uppercase tracking-wide">${e.condition}</p>
        <p class="text-gray-300 text-xs mt-0.5 leading-snug">${e.text}</p>
      </div>`).join("");
    attackerInfoPanel = `
      <div class="mt-2 mb-3 p-3 rounded-xl bg-gray-900/80 border border-gray-700/50 space-y-1.5">
        ${attackerCard.keyword ? `<p class="text-yellow-400 text-xs font-bold uppercase tracking-wide">◆ ${attackerCard.keyword}</p>` : ""}
        ${levels ? `<div class="flex flex-wrap gap-x-3">${levels}</div>` : ""}
        ${effects ? `<div class="border-t border-gray-800 pt-1.5 space-y-1.5">${effects}</div>` : ""}
        ${!attackerCard.keyword && !levels && !effects ? `<p class="text-gray-600 text-xs italic">No special abilities.</p>` : ""}
      </div>`;
  }

  return `
    <div class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="w-full max-w-md rounded-2xl border border-red-500/40 bg-gray-950/96 p-5 shadow-2xl">
        <div class="flex items-center gap-2 mb-1">
          <span class="text-red-400 text-xl">🛡</span>
          <h3 class="text-red-200 font-bold text-lg tracking-wide" style="font-family:'Chakra Petch',sans-serif">Declare Block</h3>
        </div>
        <div class="flex items-center justify-between mb-1">
          <p class="text-gray-400 text-xs">${attacker ? attacker.name + " <span class='text-red-400 font-semibold'>(" + attackerBp + " BP)</span> attacks." : "Incoming attack."}</p>
          ${attackerCard ? `<button id="block-attacker-toggle" class="text-xs px-2 py-0.5 rounded border ${blockShowAttackerInfo ? "border-sky-500/60 bg-sky-950/60 text-sky-300" : "border-gray-700 text-gray-500 hover:text-sky-400 hover:border-sky-700"} transition-colors">Abilities</button>` : ""}
        </div>
        ${attackerInfoPanel}
        <p class="text-gray-600 text-xs mb-3">Choose a blocker or take the hit.</p>
        <div class="flex flex-wrap gap-2 mb-3">
          ${blockerBtns || `<p class="text-gray-600 text-sm italic">No available blockers.</p>`}
        </div>
        <button data-block="none" class="w-full rounded-xl border border-gray-700 bg-gray-800/80 py-2 text-sm font-semibold text-gray-300 hover:bg-gray-700 transition-colors">No Block — take ${attacker?.symbols ?? 1} life damage</button>
      </div>
    </div>`;
}

function renderBattleLogModal(state) {
  if (!battleLogModalOpen) return "";
  const logItems = state.log.map((line) => `<li>${line}</li>`).join("");
  return `
    <div id="modal-backdrop-log" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="w-full max-w-2xl max-h-96 overflow-hidden rounded-2xl border border-gray-700 bg-gray-950 shadow-2xl">
        <div class="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 class="text-white font-bold text-lg">Battle Log</h2>
          <button id="modal-close-log" class="w-7 h-7 rounded-full bg-black/70 text-white text-sm hover:bg-black flex items-center justify-center">✕</button>
        </div>
        <div class="overflow-y-auto p-4" style="max-height: calc(100% - 60px)">
          <ul class="space-y-1">${logItems || "<li class='text-gray-500'>No events yet</li>"}</ul>
        </div>
      </div>
    </div>`;
}

function renderTrashModal(state) {
  if (trashModalOwner === null) return "";
  const player = state.players[trashModalOwner];
  const ownerLabel = trashModalOwner === 0 ? "Your" : "AI";
  const cards = player.trash.map((cid) => {
    const card = CARD_POOL[cid];
    if (!card) return "";
    const thumb = card.image
      ? `<img src="${card.image}" alt="${card.name}" class="w-full h-full object-cover object-top rounded-lg">`
      : `<div class="w-full h-full flex items-center justify-center bg-gray-800 rounded-lg text-gray-400 text-xs font-bold p-1 text-center">${card.name}</div>`;
    return `<button data-trash-card="${cid}" class="trash-card-btn relative w-16 h-22 rounded-lg border border-gray-700 overflow-hidden hover:border-sky-500 hover:scale-105 transition-transform" style="height:88px">
      ${thumb}
      <div class="absolute bottom-0 left-0 right-0 bg-black/70 text-xs text-center px-0.5 py-0.5 truncate">${card.name}</div>
    </button>`;
  }).join("");

  return `
    <div id="modal-backdrop-trash" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="w-full max-w-xl overflow-hidden rounded-2xl border border-gray-700 bg-gray-950 shadow-2xl">
        <div class="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 class="text-white font-bold text-lg">${ownerLabel} Trash <span class="text-gray-500 text-sm font-normal">(${player.trash.length} cards)</span></h2>
          <button id="modal-close-trash" class="w-7 h-7 rounded-full bg-black/70 text-white text-sm hover:bg-black flex items-center justify-center">✕</button>
        </div>
        <div class="overflow-y-auto p-4" style="max-height:70vh">
          ${cards
            ? `<div class="flex flex-wrap gap-2">${cards}</div>`
            : `<p class="text-gray-500 text-sm">Trash is empty.</p>`}
        </div>
      </div>
    </div>`;
}

function _invokeFlashLabel(cardId) {
  const card = CARD_POOL[cardId];
  const eff = card?.effects?.find((e) => /Invoke.*Flash|Invoke: Flash/i.test(e.condition ?? ""));
  if (!eff?.text) return "";
  return eff.text.length > 60 ? eff.text.slice(0, 58) + "…" : eff.text;
}

function renderFlashModal(state) {
  if (!state.awaitingFlash) return "";
  const you = state.players[0];
  const { attackerUid } = state.awaitingFlash;
  const allSpirits = [...state.players[0].spirits, ...state.players[1].spirits];
  const attacker = allSpirits.find((s) => s.uid === attackerUid);
  const isHumanAttacking = state.currentPlayer === 0;

  const magicBtns = you.hand.map((cid, idx) => {
    const card = CARD_POOL[cid];
    if (card?.type !== "magic") return "";
    if (!card.effects?.some((e) => e.condition === "Flash")) return "";
    const v = game.canPlayFlashMagic(idx);
    if (!v.ok) return "";
    const costTag = v.isSoulMagic
      ? `<span class="text-yellow-300 text-xs ml-1">(SC)</span>`
      : `<span class="text-gray-400 text-xs ml-1">(${v.actualCost}c)</span>`;
    return `<button data-flash-magic="${idx}" class="px-3 py-1.5 rounded-xl border border-yellow-600/60 bg-yellow-950/60 text-yellow-100 text-sm font-semibold hover:bg-yellow-900/60 transition-colors">${card.name}${costTag}</button>`;
  }).join("");

  let invokeBtns = "";
  if (isHumanAttacking) {
    if (attacker && game.canInvokeFlash(attackerUid).ok) {
      const sLabel = _invokeFlashLabel(attacker.cardId);
      invokeBtns += `<button data-invoke-flash="${attackerUid}" class="px-3 py-1.5 rounded-xl border border-orange-600/60 bg-orange-950/60 text-orange-100 text-sm font-semibold hover:bg-orange-900/60 transition-colors">${attacker.name}: Invoke Flash${sLabel ? ` <span class="text-gray-400 text-xs font-normal">${sLabel}</span>` : ""}</button>`;
    }
    // anyAttackStep spirits (e.g. Duntekleo) can invoke flash even when not the attacker
    you.spirits.forEach((s) => {
      if (s.uid !== attackerUid && game.canInvokeFlash(s.uid).ok) {
        const sLabel = _invokeFlashLabel(s.cardId);
        invokeBtns += `<button data-invoke-flash="${s.uid}" class="px-3 py-1.5 rounded-xl border border-orange-600/60 bg-orange-950/60 text-orange-100 text-sm font-semibold hover:bg-orange-900/60 transition-colors">${s.name}: Invoke Flash${sLabel ? ` <span class="text-gray-400 text-xs font-normal">${sLabel}</span>` : ""}</button>`;
      }
    });
    you.nexuses.forEach((n) => {
      if (game.canInvokeNexusFlash(n.uid).ok) {
        const nLabel = _invokeFlashLabel(n.cardId);
        invokeBtns += `<button data-invoke-nexus-flash="${n.uid}" class="px-3 py-1.5 rounded-xl border border-orange-600/60 bg-orange-950/60 text-orange-100 text-sm font-semibold hover:bg-orange-900/60 transition-colors">${n.name}: Invoke Flash${nLabel ? ` <span class="text-gray-400 text-xs font-normal">${nLabel}</span>` : ""}</button>`;
      }
    });
  }

  // Defender flash-summon buttons (when human is defending)
  let defSummonBtns = "";
  if (!isHumanAttacking) {
    defSummonBtns = you.hand.map((cid, idx) => {
      const card = CARD_POOL[cid];
      if (!card || card.type !== "spirit") return "";
      const v = game.canFlashSummon(idx);
      if (!v.ok) return "";
      return `<button data-flash-summon="${idx}" class="px-3 py-1.5 rounded-xl border border-sky-600/60 bg-sky-950/60 text-sky-100 text-sm font-semibold hover:bg-sky-900/60 transition-colors">Flash Summon: ${card.name} <span class="text-gray-400 text-xs ml-1">(${v.actualCost}c)</span></button>`;
    }).join("");
  }

  const hasActions = magicBtns || invokeBtns || defSummonBtns;
  return `
    <div class="fixed inset-0 z-50 flex items-end justify-center p-4 pointer-events-none">
      <div class="pointer-events-auto w-full max-w-lg rounded-2xl border border-yellow-500/60 bg-gray-950/96 p-5 shadow-2xl backdrop-blur-sm" style="box-shadow:0 0 40px rgba(202,138,4,0.18)">
        <div class="flex items-center gap-2 mb-1">
          <span class="text-yellow-400 text-xl">⚡</span>
          <h3 class="text-yellow-200 font-bold text-lg tracking-wide" style="font-family:'Chakra Petch',sans-serif">Flash Window</h3>
          <span class="ml-auto text-xs text-gray-500">${attacker ? attacker.name + " attacks" : ""}</span>
        </div>
        <p class="text-gray-500 text-xs mb-4">Use Flash effects before blocking, or pass.</p>
        ${hasActions ? `<div class="flex flex-wrap gap-2 mb-3">${magicBtns}${invokeBtns}${defSummonBtns}</div>` : `<p class="text-gray-600 text-sm mb-3 italic">No Flash effects available.</p>`}
        <button id="passFlash" class="w-full rounded-xl border border-gray-700 bg-gray-800/80 py-2 text-sm font-semibold text-gray-300 hover:bg-gray-700 transition-colors">Pass — proceed to block</button>
      </div>
    </div>`;
}

function renderEffectModal(state) {
  const eff = state.awaitingEffect;
  if (!eff || eff.ownerId !== 0) return "";

  const you = state.players[0];
  const opp = state.players[1];

  const OPP_RED = "px-3 py-1.5 rounded-xl border border-red-600/50 bg-red-950/60 text-red-100 text-sm font-semibold hover:bg-red-900/60 transition-colors";
  const OWN_BLUE = "px-3 py-1.5 rounded-xl border border-blue-600/50 bg-blue-950/60 text-blue-100 text-sm font-semibold hover:bg-blue-900/60 transition-colors";
  const CARD_GREEN = "px-3 py-1.5 rounded-xl border border-green-600/50 bg-green-950/60 text-green-100 text-sm font-semibold hover:bg-green-900/60 transition-colors";

  function spiritBtn(s, cls) {
    const bp = getEffectiveBP(s, CARD_POOL[s.cardId]);
    return `<button data-resolve-effect="${s.uid}" class="${cls}">${s.name} (${bp} BP)</button>`;
  }

  let targetBtns = "";

  const OWN_SPIRIT_EFFECTS = new Set(["coreFromVoidToOwnSpirit", "refreshOwnSpirit", "destroyOwnSpirit", "exhaustOwnSpirit", "tombsPickPurple", "exhaustToBlock", "coreFromTrashToOwnSpirit", "bpBoostOwnClashSpirit2000", "triggerSummonEffect", "quarryPlainRefresh", "coelaTargetAF"]);
  const OPP_SPIRIT_EFFECTS = new Set(["destroySpirit", "sendCoreFromSpirit", "sendCoreAndDrawIfDepleted", "drainToOne", "exhaustSpirit", "returnToHand", "returnToDeckBottom", "bpDamage2000", "bpDamage4000", "forceAttack", "defensiveGateSecond", "barrageForestDestroy", "bubbleClusterExhaust", "forceExhaustedBlock"]);

  if (OWN_SPIRIT_EFFECTS.has(eff.type)) {
    targetBtns = eff.validTargets.map((uid) => {
      const s = you.spirits.find((sp) => sp.uid === uid);
      return s ? spiritBtn(s, OWN_BLUE) : "";
    }).join("");
  } else if (OPP_SPIRIT_EFFECTS.has(eff.type)) {
    targetBtns = eff.validTargets.map((uid) => {
      const s = opp.spirits.find((sp) => sp.uid === uid);
      return s ? spiritBtn(s, OPP_RED) : "";
    }).join("");
  } else if (eff.type === "destroyNexus") {
    targetBtns = eff.validTargets.map((uid) => {
      const n = opp.nexuses.find((nx) => nx.uid === uid);
      return n ? `<button data-resolve-effect="${uid}" class="${OPP_RED}">${n.name}</button>` : "";
    }).join("");
  } else if (eff.type === "returnCardFromTrash" || eff.type === "summonFromTrash") {
    targetBtns = eff.validTargets.map((cid) => {
      const card = CARD_POOL[cid];
      return `<button data-resolve-card="${cid}" class="${CARD_GREEN}">${card?.name ?? cid}</button>`;
    }).join("");
  } else if (eff.type === "selectFlashTarget" || eff.type === "selectMagicFlashTarget") {
    const allSpirits = [...you.spirits, ...opp.spirits];
    targetBtns = eff.validTargets.map((uid) => {
      const s = allSpirits.find((sp) => sp.uid === uid);
      if (!s) return "";
      return spiritBtn(s, s.ownerId === 0 ? OWN_BLUE : OPP_RED);
    }).join("");
  } else if (eff.type === "returnHandCardToDeckBottom" || eff.type === "magirrateMagic" || eff.type === "discardWindfangForBP") {
    targetBtns = eff.validTargets.map((idxStr) => {
      const idx = parseInt(idxStr);
      const cardId = you.hand[idx];
      const card = CARD_POOL[cardId];
      return card ? `<button data-resolve-effect="${idxStr}" class="${CARD_GREEN}">${card.name}</button>` : "";
    }).join("");
  } else if (eff.type === "feedingDrawReturnCards" || eff.type === "menhirCircleSelectCards" || eff.type === "rockDrillingSelectCards" || eff.type === "nestlingSelectCards" || eff.type === "emeraldAbyssInvokeMain") {
    // Hand card selection effects - validTargets contains card IDs
    const maxSelect = eff.type === "feedingDrawReturnCards" ? 2 :
                     eff.type === "menhirCircleSelectCards" ? 2 :
                     eff.type === "rockDrillingSelectCards" ? 3 :
                     eff.type === "emeraldAbyssInvokeMain" ? 1 : 2;
    const selectedSet = new Set(multiSelectCards?.selectedCards ?? []);
    targetBtns = eff.validTargets.map((cardId) => {
      const card = CARD_POOL[cardId];
      const isSelected = selectedSet.has(cardId);
      const btnClass = isSelected ? "px-3 py-1.5 rounded-xl border border-yellow-500 bg-yellow-950/70 text-yellow-100 text-sm font-semibold" : CARD_GREEN;
      return card ? `<button data-resolve-card="${cardId}" class="${btnClass}" data-select-max="${maxSelect}">${card.name}${isSelected ? " ✓" : ""}</button>` : "";
    }).join("");
  } else if (eff.type === "magirrateMagicTarget") {
    const allSpirits = [...you.spirits, ...opp.spirits];
    targetBtns = eff.validTargets.map((uid) => {
      const s = allSpirits.find((sp) => sp.uid === uid);
      if (!s) return "";
      return spiritBtn(s, s.ownerId === 0 ? OWN_BLUE : OPP_RED);
    }).join("");
  } else if (eff.type === "selectMagicTarget") {
    const allSpirits = [...you.spirits, ...opp.spirits];
    const allNexuses = [...(you.nexuses ?? []), ...(opp.nexuses ?? [])];
    targetBtns = eff.validTargets.map((uid) => {
      const nx = allNexuses.find((n) => n.uid === uid);
      if (nx) {
        const cls = nx.ownerId === 0 ? OWN_BLUE : OPP_RED;
        return `<button data-resolve-effect="${uid}" class="${cls}">${nx.name}</button>`;
      }
      const sp = allSpirits.find((s) => s.uid === uid);
      if (sp) {
        return spiritBtn(sp, sp.ownerId === 0 ? OWN_BLUE : OPP_RED);
      }
      return "";
    }).join("");
  } else {
    // Generic fallback: search all field entities
    const all = [...you.spirits, ...opp.spirits, ...(you.nexuses ?? []), ...(opp.nexuses ?? [])];
    targetBtns = eff.validTargets.map((uid) => {
      const e = all.find((x) => x.uid === uid);
      if (!e) return "";
      const cls = e.ownerId === 0 ? OWN_BLUE : OPP_RED;
      const bp = e.bp !== undefined ? ` (${getEffectiveBP(e, CARD_POOL[e.cardId])} BP)` : "";
      return `<button data-resolve-effect="${uid}" class="${cls}">${e.name}${bp}</button>`;
    }).join("");
  }

  // Show Skip when optional; show OK when no valid targets (prevent game lock)
  const noTargets = eff.validTargets.length === 0;
  const showSkip = eff.optional || noTargets;
  const skipLabel = noTargets ? "OK" : "Skip";
  
  // For multi-select: show submit button when ready
  const isMultiSelect = ["feedingDrawReturnCards", "menhirCircleSelectCards", "rockDrillingSelectCards", "nestlingSelectCards", "emeraldAbyssInvokeMain"].includes(eff.type);
  const maxSelect = isMultiSelect ?
    (eff.type === "feedingDrawReturnCards" ? 2 :
     eff.type === "menhirCircleSelectCards" ? 2 :
     eff.type === "rockDrillingSelectCards" ? 3 :
     eff.type === "emeraldAbyssInvokeMain" ? 1 : 2) : 0;
  const selectedCount = multiSelectCards?.selectedCards?.length ?? 0;

  let submitBtn = "";
  if (isMultiSelect) {
    const isReady = (eff.type === "feedingDrawReturnCards" && selectedCount === 2) ||
                   (eff.type === "menhirCircleSelectCards" && selectedCount <= 2 && selectedCount > 0) ||
                   (eff.type === "rockDrillingSelectCards" && selectedCount <= 3 && selectedCount > 0) ||
                   (eff.type === "nestlingSelectCards" && selectedCount <= 2 && selectedCount > 0) ||
                   (eff.type === "emeraldAbyssInvokeMain" && selectedCount === 1);
    submitBtn = isReady ? 
      `<button data-resolve-effect="submit" class="px-3 py-1.5 rounded-xl border border-green-600/50 bg-green-950/60 text-green-100 text-sm font-semibold hover:bg-green-900/60 transition-colors">Submit (${selectedCount}/${maxSelect})</button>` : "";
  }
  
  const skipBtn = showSkip
    ? `<button data-resolve-effect="skip" class="px-3 py-1.5 rounded-xl border border-gray-700 bg-gray-800 text-gray-300 text-sm font-semibold hover:bg-gray-700 transition-colors">${skipLabel}</button>` : "";

  return `
    <div class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="w-full max-w-md rounded-2xl border border-sky-500/40 bg-gray-950/96 p-5 shadow-2xl">
        <div class="flex items-center gap-2 mb-4">
          <span class="text-sky-400 text-lg">✦</span>
          <h3 class="text-sky-200 font-bold text-base" style="font-family:'Chakra Petch',sans-serif">${eff.label}</h3>
        </div>
        <div class="flex flex-wrap gap-2">${targetBtns}${submitBtn}${skipBtn}</div>
      </div>
    </div>`;
}

function renderModals(state) {
  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) return;

  let html = "";
  if (battleLogModalOpen) {
    html = renderBattleLogModal(state);
  } else if (trashModalOwner !== null) {
    html = renderTrashModal(state);
  } else if (magicEffectChoice) {
    html = renderMagicEffectChoiceModal();
  } else if (nexusPayFlow) {
    html = renderNexusPayModal(state?.players[0]);
  } else if (magicPayFlow) {
    html = renderMagicPayModal(state?.players[0]);
  } else if (summonFlow) {
    html = renderSummonFlowModal(state?.players[0]);
  } else if (cardDetailId) {
    html = renderCardDetailModal(cardDetailId, cardDetailIndex);
  } else if (state?.awaitingEffect?.type === "deckReveal") {
    html = renderDeckRevealModal(state.awaitingEffect, state.awaitingEffect.ownerId === 0);
  } else if (state?.awaitingEffect && state.awaitingEffect.ownerId === 0) {
    html = renderEffectModal(state);
  } else if (state?.awaitingFlash) {
    html = renderFlashModal(state);
  } else if (state?.awaitingBlock && state.awaitingBlock.defenderId === 0) {
    html = renderBlockModal(state);
  }
  modalRoot.innerHTML = html;

  // Battle log close
  document.getElementById("modal-backdrop-log")?.addEventListener("click", (e) => {
    if (e.target.id === "modal-backdrop-log") { battleLogModalOpen = false; renderModals(game?.getState()); }
  });
  document.getElementById("modal-close-log")?.addEventListener("click", () => {
    battleLogModalOpen = false; renderModals(game?.getState());
  });

  // Trash modal close + card click
  document.getElementById("modal-backdrop-trash")?.addEventListener("click", (e) => {
    if (e.target.id === "modal-backdrop-trash") { trashModalOwner = null; renderModals(game?.getState()); }
  });
  document.getElementById("modal-close-trash")?.addEventListener("click", () => {
    trashModalOwner = null; renderModals(game?.getState());
  });
  document.querySelectorAll(".trash-card-btn").forEach((el) => {
    el.addEventListener("click", () => {
      const cid = el.getAttribute("data-trash-card");
      trashModalOwner = null;
      cardDetailId = cid; cardDetailIndex = null;
      renderModals(game?.getState());
    });
  });

  // Summon/magic/nexus flow — adjust core counts
  document.querySelectorAll("[data-sf-adj]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!summonFlow && !magicPayFlow && !nexusPayFlow) return;
      _sfAdjust(btn.dataset.sfStep, btn.dataset.sfAdj, parseInt(btn.dataset.sfDir));
    });
  });
  // Summon/magic/nexus flow — toggle soul core
  document.querySelectorAll("[data-sf-soul]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!summonFlow && !magicPayFlow && !nexusPayFlow) return;
      _sfToggleSoul(btn.dataset.sfStep, btn.dataset.sfSoul);
    });
  });

  // Nexus pay flow — cancel
  document.getElementById("npf-cancel")?.addEventListener("click", () => {
    nexusPayFlow = null; renderModals(game?.getState());
  });
  // Nexus pay flow — confirm
  document.getElementById("npf-confirm")?.addEventListener("click", () => {
    if (!nexusPayFlow || _sfSpecTotal(nexusPayFlow.paySpec) !== nexusPayFlow.actualCost) return;
    const { handIndex, card, paySpec } = nexusPayFlow;
    nexusPayFlow = null;
    _showCardReveal(card);
    _pendingActionLabel = { text: `Deploy: ${card.name}`, color: COLOR_CSS[card.color] ?? '#22c55e' };
    game.deployNexus(handIndex, paySpec);
    render(); runAiTurnLoop();
  });

  // Magic pay flow — cancel
  document.getElementById("mpf-cancel")?.addEventListener("click", () => {
    magicPayFlow = null; renderModals(game?.getState());
  });
  // Magic pay flow — confirm
  document.getElementById("mpf-confirm")?.addEventListener("click", () => {
    if (!magicPayFlow || _sfSpecTotal(magicPayFlow.paySpec) !== magicPayFlow.actualCost) return;
    const { context, handIndex, card, paySpec } = magicPayFlow;
    magicPayFlow = null;
    _showCardReveal(card);
    _pendingActionLabel = { text: `Magic: ${card.name}`, color: "#a855f7" };
    if (context === 'flashWindow') {
      game.playFlashMagic(handIndex, null, paySpec);
      if (!_tryAutoPassFlash()) { render(); runAiTurnLoop(); }
    } else {
      game.playMagic(handIndex, null, context === 'mainFlash', paySpec);
      render(); runAiTurnLoop();
    }
  });
  // Summon flow — cancel
  document.getElementById("sf-cancel")?.addEventListener("click", () => {
    summonFlow = null; renderModals(game?.getState());
  });
  // Summon flow — legacy banish −/+
  document.getElementById("sf-legacy-dec")?.addEventListener("click", () => {
    if (!summonFlow || summonFlow.legacyBanishCount <= 0) return;
    summonFlow.legacyBanishCount--;
    summonFlow.paySpec = _sfEmptySpec();
    renderModals(game?.getState());
  });
  document.getElementById("sf-legacy-inc")?.addEventListener("click", () => {
    if (!summonFlow) return;
    const maxBanish = Math.min(summonFlow.legacyAvailable, summonFlow.actualCost);
    if (summonFlow.legacyBanishCount >= maxBanish) return;
    summonFlow.legacyBanishCount++;
    summonFlow.paySpec = _sfEmptySpec();
    renderModals(game?.getState());
  });
  // Summon flow — next (payment → placement)
  document.getElementById("sf-next")?.addEventListener("click", () => {
    if (!summonFlow) return;
    const finalCost = Math.max(0, summonFlow.actualCost - summonFlow.legacyBanishCount);
    if (_sfSpecTotal(summonFlow.paySpec) !== finalCost) return;
    summonFlow.step = 'placement';
    summonFlow.placeSpec = _sfEmptySpec();
    renderModals(game?.getState());
  });
  // Summon flow — back (placement → payment)
  document.getElementById("sf-back")?.addEventListener("click", () => {
    if (!summonFlow) return;
    summonFlow.step = 'payment';
    summonFlow.placeSpec = _sfEmptySpec();
    renderModals(game?.getState());
  });
  // Summon flow — confirm summon
  document.getElementById("sf-confirm")?.addEventListener("click", () => {
    if (!summonFlow || _sfSpecTotal(summonFlow.placeSpec) < summonFlow.lv1Min) return;
    const { handIndex, card, paySpec, placeSpec, legacyBanishCount } = summonFlow;
    summonFlow = null;
    _showCardReveal(card);
    _pendingActionLabel = { text: `Summon: ${card.name}`, color: COLOR_CSS[card.color] ?? "#f97316" };
    game.summonWithSpecs(handIndex, paySpec, placeSpec, legacyBanishCount);
    render(); runAiTurnLoop();
  });

  // Deck reveal confirm
  document.getElementById("deck-reveal-confirm")?.addEventListener("click", () => {
    game.resolveEffect(null, aiBlockChooser);
    render(); runAiTurnLoop();
  });

  // Magic effect choice modal
  document.getElementById("mec-cancel")?.addEventListener("click", () => {
    magicEffectChoice = null; renderModals(game?.getState());
  });
  document.getElementById("mec-main")?.addEventListener("click", () => {
    if (!magicEffectChoice) return;
    const { handIndex } = magicEffectChoice;
    magicEffectChoice = null;
    openMagicPayFlow(handIndex, 'main');
  });
  document.getElementById("mec-flash")?.addEventListener("click", () => {
    if (!magicEffectChoice) return;
    const { handIndex } = magicEffectChoice;
    magicEffectChoice = null;
    openMagicPayFlow(handIndex, 'mainFlash');
  });

  // Card detail close
  document.getElementById("modal-backdrop")?.addEventListener("click", (e) => {
    if (e.target.id === "modal-backdrop") { cardDetailId = null; cardDetailIndex = null; renderModals(game?.getState()); }
  });
  document.getElementById("modal-close-card")?.addEventListener("click", () => {
    cardDetailId = null; cardDetailIndex = null; renderModals(game?.getState());
  });

  // Card actions from modal
  document.getElementById("modal-summon")?.addEventListener("click", () => {
    const idx = cardDetailIndex;
    cardDetailId = null; cardDetailIndex = null;
    openSummonFlow(idx);
  });
  document.getElementById("modal-deploy")?.addEventListener("click", () => {
    const idx = cardDetailIndex;
    cardDetailId = null; cardDetailIndex = null;
    clickDeploy(idx);
  });
  document.getElementById("modal-magic")?.addEventListener("click", () => {
    const idx = cardDetailIndex;
    cardDetailId = null; cardDetailIndex = null;
    clickPlayMagic(idx);
  });

  // Flash
  document.querySelectorAll("[data-flash-magic]").forEach((el) => {
    el.onclick = () => clickPlayFlashMagic(Number(el.getAttribute("data-flash-magic")));
  });
  document.querySelectorAll("[data-invoke-flash]").forEach((el) => {
    el.onclick = () => clickInvokeFlash(el.getAttribute("data-invoke-flash"));
  });
  document.querySelectorAll("[data-invoke-nexus-flash]").forEach((el) => {
    el.onclick = () => clickInvokeNexusFlash(el.getAttribute("data-invoke-nexus-flash"));
  });
  document.querySelectorAll("[data-flash-summon]").forEach((el) => {
    el.onclick = () => clickFlashSummon(el.getAttribute("data-flash-summon"));
  });
  document.getElementById("passFlash")?.addEventListener("click", clickPassFlash);

  // Block
  document.getElementById("block-attacker-toggle")?.addEventListener("click", () => {
    blockShowAttackerInfo = !blockShowAttackerInfo;
    renderModals(game?.getState());
  });
  document.querySelectorAll("[data-block]").forEach((el) => {
    el.onclick = () => {
      blockShowAttackerInfo = false;
      const v = el.getAttribute("data-block");
      clickBlock(v === "none" ? null : v);
    };
  });

  // Effect
  document.querySelectorAll("[data-resolve-effect]").forEach((el) => {
    el.onclick = () => {
      const v = el.getAttribute("data-resolve-effect");
      clickResolveEffect(v === "skip" ? null : v);
    };
  });
  document.querySelectorAll("[data-resolve-card]").forEach((el) => {
    el.onclick = () => clickResolveEffect(el.getAttribute("data-resolve-card"));
  });
}

// ─── Match screen ─────────────────────────────────────────────────────────────

function renderMatch() {
  const state = game.getState();
  const you = state.players[0];
  const aiPlayer = state.players[1];
  const winnerText = state.winner === null ? ""
    : `<div class="winner">${state.winner === 0 ? "You Win!" : "AI Wins"}</div>`;

  // Snapshot for animation diff (must happen before root.innerHTML)
  const newSpiritUids = [new Set(), new Set()];
  state.players.forEach((p, i) => {
    p.spirits.forEach((s) => newSpiritUids[i].add(s.uid));
    (p.nexuses ?? []).forEach((n) => newSpiritUids[i].add(n.uid));
  });
  const destroyedUids = new Set();
  prevSpiritUids.forEach((set, i) => {
    set.forEach((uid) => { if (!newSpiritUids[i].has(uid)) destroyedUids.add(uid); });
  });
  const snapHandLengths = [...prevHandLengths];

  root.innerHTML = `
    <main class="screen match-screen">
      ${renderAiHand(aiPlayer)}
      <section class="board-shell">
        

        <section class="field-core">
          ${winnerText}
          <div style="display: grid; grid-template-columns: 120px auto 120px; ">
          <div>
            <h4>Deck</h4>
            <div class="deck-pile" id="deck-pile-ai">
              <div class="deck-stack">
                <img src="./assets/BS_back.webp" alt="">
                <img src="./assets/BS_back.webp" alt="">
                <img src="./assets/BS_back.webp" alt="">
              </div>
              <span class="deck-count">${aiPlayer.deck.length}</span>
            </div>
           <h4>Trash <button id="view-trash-ai" class="mini" style="font-size:9px;padding:2px 5px">View</button></h4>
            <div class="resource-row"><span class="tag">Core</span><div class="core-strip">${renderCoreIcons(aiPlayer.trashCore.normal, aiPlayer.trashCore.soul, 8)}</div></div>
            <div class="resource-row"><span class="tag">Cards</span><span>${aiPlayer.trash.length}</span></div>
          </div>
          <div>
          ${renderSpiritLane(aiPlayer, state, false)}
           </div>
           <div style="width: 100px;">
            <div class="resource-row"><span class="tag">AI</span><div class="core-strip">${renderCoreIcons(aiPlayer.reserve.normal, aiPlayer.reserve.soul, 8)}</div></div>
         <h4>Reserve</h4>
            <span class="tag">AI Life</span><div class="life-grid">${renderLifeDots(aiPlayer.life)}</div></div>
          </div>
            <div class="battle-logo">
            <div class="turn-info" style="text-align: center; font-size: 11px; color: #999; display: flex; justify-content: center; gap: 15px; align-items: center;">
              <div>${renderTurnSequence(state.phase)}</div>
              <div>Phase: ${state.phase} | Turn ${state.turnNumber + 1} | ${state.players[state.currentPlayer].name}</div>             
              <button id="nextPhase" class="primary" ${state.winner !== null ? "disabled" : ""}>End Phase</button>
              <button id="restart" class="ghost">Restart</button>
              <button id="toMenu" class="ghost">Menu</button>
              <button id="viewLog" class="ghost">View Log</button>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 120px auto 120px; ">
          <div style="width: 100px;"><span class="tag">You Life</span><div class="life-grid">${renderLifeDots(you.life)}</div>
          <h4>Reserve</h4>
            <div class="resource-row"><span class="tag">You</span><div class="core-strip">${renderCoreIcons(you.reserve.normal, you.reserve.soul, 8)}</div></div>
            </div>
          <div>
          ${renderSpiritLane(you, state, true)}
          </div>
          <div>
            <h4>Deck</h4>
            <div class="deck-pile" id="deck-pile-you">
              <div class="deck-stack">
                <img src="./assets/BS_back.webp" alt="">
                <img src="./assets/BS_back.webp" alt="">
                <img src="./assets/BS_back.webp" alt="">
              </div>
              <span class="deck-count">${you.deck.length}</span>
            </div>
           <h4>Trash <button id="view-trash-you" class="mini" style="font-size:9px;padding:2px 5px">View</button></h4>
            <div class="resource-row"><span class="tag">Core</span><div class="core-strip">${renderCoreIcons(you.trashCore.normal, you.trashCore.soul, 8)}</div></div>
            <div class="resource-row"><span class="tag">Cards</span><span>${you.trash.length}</span></div>
          </div>
          </div>
        </section>

        
      </section>

      <section class="panel bottom-strip">
        <div class="flex justify-between items-center mb-2">
          ${renderHand(you, state)}
        
        </div>
      </section>
    </main>`;

  // Apply animations (must run before prevExhausted snapshot is updated)
  applyMatchAnimations(state, destroyedUids, snapHandLengths);

  // Update animation snapshots
  prevSpiritUids = newSpiritUids;
  prevHandLengths = [you.hand.length, aiPlayer.hand.length];

  // Snapshot exhausted UIDs for animation dedup
  prevExhausted.clear();
  state.players.forEach((p) => {
    p.spirits.forEach((s) => { if (s.exhausted) prevExhausted.add(s.uid); });
    p.nexuses.forEach((n) => { if (n.exhausted) prevExhausted.add(n.uid); });
  });

  document.getElementById("nextPhase").onclick = clickNextPhase;
  document.getElementById("restart").onclick = () => startGame();
  document.getElementById("toMenu").onclick = () => { screen = "menu"; game = null; render(); };
  document.getElementById("viewLog").onclick = () => { battleLogModalOpen = true; renderModals(state); };
  document.getElementById("view-trash-ai")?.addEventListener("click", () => { trashModalOwner = 1; renderModals(state); });
  document.getElementById("view-trash-you")?.addEventListener("click", () => { trashModalOwner = 0; renderModals(state); });

  document.querySelectorAll("[data-summon]").forEach((el) => {
    el.onclick = () => openSummonFlow(Number(el.getAttribute("data-summon")));
  });
  document.querySelectorAll("[data-deploy]").forEach((el) => {
    el.onclick = () => clickDeploy(Number(el.getAttribute("data-deploy")));
  });
  document.querySelectorAll("[data-magic]").forEach((el) => {
    el.onclick = () => clickPlayMagic(Number(el.getAttribute("data-magic")));
  });
  document.querySelectorAll("[data-attack]").forEach((el) => {
    el.onclick = () => clickAttack(el.getAttribute("data-attack"));
  });
  document.querySelectorAll("[data-invoke-main]").forEach((el) => {
    el.onclick = () => clickInvokeMain(el.getAttribute("data-invoke-main"));
  });
  document.querySelectorAll("[data-invoke-nexus-main]").forEach((el) => {
    el.onclick = () => clickInvokeNexusMain(el.getAttribute("data-invoke-nexus-main"));
  });
  document.querySelectorAll("[data-mv]").forEach((el) => {
    el.onclick = () => {
      const [ft, fu, tt, tu, sc] = el.getAttribute("data-mv").split(",");
      clickMoveCore(ft, fu || null, tt, tu || null, sc === "1");
    };
  });
  document.querySelectorAll("[data-card-detail]").forEach((el) => {
    el.onclick = (e) => {
      e.stopPropagation();
      cardDetailId = el.getAttribute("data-card-detail");
      cardDetailIndex = el.getAttribute("data-card-index") ? Number(el.getAttribute("data-card-index")) : null;
      renderModals(state);
    };
  });

  renderModals(state);
}

// ─── Card Gallery ─────────────────────────────────────────────────────────────

const COLOR_CSS = { red: "#ef4444", blue: "#3b82f6", green: "#22c55e", white: "#e5e7eb", yellow: "#eab308", purple: "#a855f7" };

function renderGalleryDetailModal(cid) {
  const card = CARD_POOL[cid];
  if (!card) return "";
  const thumb = card.image
    ? `<img src="${card.image}" alt="${card.name}" class="w-full object-cover rounded-t-2xl" style="max-height:320px;object-position:top" />`
    : `<div class="w-full h-40 flex items-center justify-center bg-gray-800 rounded-t-2xl text-gray-400 text-3xl font-bold">${card.name.slice(0, 2).toUpperCase()}</div>`;
  const typeColor = card.type === "spirit" ? "text-orange-400 border-orange-400"
    : card.type === "nexus" ? "text-green-400 border-green-400" : "text-purple-400 border-purple-400";
  const effects = (card.effects ?? []).map((e) => `
    <div>
      <p class="text-sky-300 font-bold text-xs uppercase tracking-wide">${e.condition}</p>
      <p class="text-gray-300 text-sm mt-0.5 leading-snug">${e.text}</p>
    </div>`).join("");
  const levelsHtml = card.levels?.length ? `
    <div class="border-t border-gray-800 pt-2">
      <p class="text-gray-500 text-xs uppercase tracking-wide mb-1">Levels</p>
      <div class="flex flex-col gap-1">
        ${card.levels.map(l => `<div class="text-xs text-gray-400">LV${l.level}: <b class="text-white">${l.bp?.toLocaleString()}</b> BP &mdash; ${l.cores} cores</div>`).join("")}
      </div>
    </div>` : "";
  return `
    <div id="gallery-modal-backdrop" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" style="overflow-y:auto;">
      <div class="w-full max-w-xs overflow-hidden rounded-2xl border border-gray-700 bg-gray-950 shadow-2xl my-auto">
        <div class="relative">${thumb}
          <button id="gallery-modal-close" class="absolute right-2 top-2 w-7 h-7 rounded-full bg-black/70 text-white text-sm hover:bg-black flex items-center justify-center">✕</button>
        </div>
        <div class="p-4 space-y-2">
          <div class="flex items-start justify-between gap-2">
            <div>
              <h2 class="text-white font-bold text-base leading-tight">${card.name}</h2>
              ${card.jpName ? `<p class="text-gray-500 text-xs">${card.jpName}</p>` : ""}
            </div>
            <span class="${typeColor} text-xs font-bold uppercase tracking-wide border rounded px-1.5 py-0.5">${card.type}</span>
          </div>
          <div class="flex flex-wrap gap-x-3 gap-y-0.5 text-sm text-gray-400">
            <span>Cost <b class="text-white">${card.cost}</b></span>
            <span>${card.color ? `<span style="color:${COLOR_CSS[card.color] ?? "#fff"}">${card.color}</span>` : ""} &mdash; Red <b class="text-white">${card.reduction}</b></span>
            ${card.bp ? `<span>BP <b class="text-white">${card.bp.toLocaleString()}</b></span>` : ""}
            ${card.symbols ? `<span>Sym <b class="text-white">${card.symbols}</b></span>` : ""}
            ${card.family ? `<span class="text-gray-500 w-full text-xs">${Array.isArray(card.family) ? card.family.join(", ") : card.family}</span>` : ""}
          </div>
          ${card.keyword ? `<p class="text-yellow-400 text-xs font-bold uppercase tracking-wide">◆ ${Array.isArray(card.keyword) ? card.keyword.join(", ") : card.keyword}</p>` : ""}
          ${effects ? `<div class="border-t border-gray-800 pt-2 space-y-2">${effects}</div>` : ""}
          ${levelsHtml}
        </div>
      </div>
    </div>`;
}

function renderCardGallery() {
  const allCards = Object.values(CARD_POOL);
  const colors = [...new Set(allCards.map(c => c.color).filter(Boolean))].sort();
  const types = [...new Set(allCards.map(c => c.type).filter(Boolean))].sort();
  const sets = [...new Set(allCards.map(c => c.set).filter(Boolean))].sort();

  const q = gallerySearch.toLowerCase();
  const filtered = allCards.filter(card => {
    if (galleryColorFilter && card.color !== galleryColorFilter) return false;
    if (galleryTypeFilter && card.type !== galleryTypeFilter) return false;
    if (gallerySetFilter && card.set !== gallerySetFilter) return false;
    if (galleryFormatFilter && card.format !== galleryFormatFilter) return false;
    if (q) {
      const str = (v) => Array.isArray(v) ? v.join(" ") : (v ?? "");
      return (
        str(card.name).toLowerCase().includes(q) ||
        str(card.jpName).toLowerCase().includes(q) ||
        str(card.family).toLowerCase().includes(q) ||
        str(card.keyword).toLowerCase().includes(q)
      );
    }
    return true;
  });

  const isAllActive = !galleryColorFilter && !galleryTypeFilter && !gallerySetFilter && !galleryFormatFilter;

  const colorBtns = colors.map(c => {
    const dot = `<span class="gallery-filter-dot" style="background:${COLOR_CSS[c] ?? "#aaa"}"></span>`;
    return `<button class="gallery-filter-btn${galleryColorFilter === c ? " active" : ""}" data-color="${c}">${dot}${c}</button>`;
  }).join("");

  const typeBtns = types.map(t =>
    `<button class="gallery-filter-btn${galleryTypeFilter === t ? " active" : ""}" data-type="${t}">${t}</button>`
  ).join("");

  const setBtns = sets.map(s =>
    `<button class="gallery-filter-btn${gallerySetFilter === s ? " active" : ""}" data-set="${s}">${SET_LABELS[s] ?? s}</button>`
  ).join("");

  const formatBtns = ["Standard", "Eternal"].map(f =>
    `<button class="gallery-filter-btn${galleryFormatFilter === f ? " active" : ""}" data-format="${f}">${f}</button>`
  ).join("");

  const cardsHtml = filtered.length ? filtered.map(card => {
    const dotColor = COLOR_CSS[card.color] ?? "#aaa";
    const setTag = card.set ? `<span class="gallery-card-set">${SET_LABELS[card.set] ?? card.set}</span>` : "";
    return `
      <button class="gallery-card-item" data-cid="${card.id}" title="${card.name}">
        <img src="${card.image}" alt="${card.name}" loading="lazy" class="gallery-card-img" />
        <div class="gallery-card-label">
          <span class="gallery-card-dot" style="background:${dotColor}"></span>
          <span class="gallery-card-name">${card.name}</span>
          ${setTag}
        </div>
      </button>`;
  }).join("") : `<p class="gallery-empty">No cards found</p>`;

  const modal = galleryDetailId ? renderGalleryDetailModal(galleryDetailId) : "";

  root.innerHTML = `
    <main class="gallery-screen">
      <header class="gallery-header">
        <button id="gallery-back" class="ghost" style="padding:6px 14px;">← Back</button>
        <h2 class="gallery-title">Card Gallery</h2>
        <span class="gallery-count">${filtered.length} / ${allCards.length}</span>
      </header>
      <div class="gallery-controls">
        <input type="search" id="gallery-search" class="gallery-search-input" placeholder="Search name, family, keyword…" value="${gallerySearch.replace(/"/g, '&quot;')}" autocomplete="off" />
        <div class="gallery-filters">
          <button class="gallery-filter-btn${isAllActive ? " active" : ""}" id="gallery-all">All</button>
          ${colorBtns}
          <span class="gallery-filter-sep">|</span>
          ${typeBtns}
          <span class="gallery-filter-sep">|</span>
          ${setBtns}
          <span class="gallery-filter-sep">|</span>
          ${formatBtns}
        </div>
      </div>
      <div class="gallery-grid">${cardsHtml}</div>
    </main>
    ${modal ? `<div id="gallery-modal-root">${modal}</div>` : ""}`;

  document.getElementById("gallery-back").onclick = () => { galleryDetailId = null; screen = "menu"; render(); };

  const searchEl = document.getElementById("gallery-search");
  searchEl.oninput = (e) => {
    gallerySearch = e.target.value;
    const cursor = e.target.selectionStart;
    renderCardGallery();
    const el = document.getElementById("gallery-search");
    if (el) { el.focus(); el.setSelectionRange(cursor, cursor); }
  };

  document.getElementById("gallery-all")?.addEventListener("click", () => {
    galleryColorFilter = null; galleryTypeFilter = null; gallerySetFilter = null; galleryFormatFilter = null; renderCardGallery();
  });
  document.querySelectorAll("[data-color]").forEach(btn => {
    btn.onclick = () => { galleryColorFilter = galleryColorFilter === btn.dataset.color ? null : btn.dataset.color; renderCardGallery(); };
  });
  document.querySelectorAll("[data-type]").forEach(btn => {
    btn.onclick = () => { galleryTypeFilter = galleryTypeFilter === btn.dataset.type ? null : btn.dataset.type; renderCardGallery(); };
  });
  document.querySelectorAll("[data-set]").forEach(btn => {
    btn.onclick = () => { gallerySetFilter = gallerySetFilter === btn.dataset.set ? null : btn.dataset.set; renderCardGallery(); };
  });
  document.querySelectorAll("[data-format]").forEach(btn => {
    btn.onclick = () => { galleryFormatFilter = galleryFormatFilter === btn.dataset.format ? null : btn.dataset.format; renderCardGallery(); };
  });
  document.querySelectorAll(".gallery-card-item").forEach(btn => {
    btn.onclick = () => { galleryDetailId = btn.dataset.cid; renderCardGallery(); };
  });
  document.getElementById("gallery-modal-close")?.addEventListener("click", () => { galleryDetailId = null; renderCardGallery(); });
  document.getElementById("gallery-modal-backdrop")?.addEventListener("click", (e) => {
    if (e.target.id === "gallery-modal-backdrop") { galleryDetailId = null; renderCardGallery(); }
  });
}

// ─── Menu / Deck select ───────────────────────────────────────────────────────

function renderMenu() {
  root.innerHTML = `
    <main class="screen menu-screen" style="display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:20px;min-height:100vh;">
      <section class="hero-card"  >
        <img src="/assets/BS-HOME-Banner-R.png" style="max-width: 356px;align-items: center;">
        <p class="subtitle">Solo PVE Prototype</p>
        <button id="toDeckSelect" class="primary p-1">Start Match</button>
        <button id="toGallery" class="ghost p-1" style="margin-top:10px;">Card Gallery</button>
      </section>
      <img src="assets/26RBS01_banner.webp" style="max-width: 393px;">
    </main>`;
  document.getElementById("toDeckSelect").onclick = () => { screen = "deck"; render(); };
  document.getElementById("toGallery").onclick = () => { screen = "gallery"; render(); };
}

function renderDeckListModal(deckId) {
  const deck = DECKS[deckId];
  if (!deck) return "";
  const rows = deck.cards.map(cid => {
    const c = CARD_POOL[cid];
    if (!c) return "";
    const dot = c.color ? `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${COLOR_CSS[c.color] ?? "#aaa"};margin-right:4px;flex-shrink:0"></span>` : "";
    return `<div style="display:flex;align-items:center;gap:6px;padding:3px 0;border-bottom:1px solid #1f2937">
      <img src="${c.image}" alt="${c.name}" style="width:32px;height:32px;object-fit:cover;border-radius:4px;flex-shrink:0">
      <span style="flex:1;font-size:12px;color:#e5e7eb">${dot}${c.name}</span>
      <span style="font-size:11px;color:#6b7280">${c.type ?? ""}</span>
    </div>`;
  }).join("");
  return `
    <div id="deck-list-backdrop" style="position:fixed;inset:0;z-index:60;background:rgba(0,0,0,0.85);display:flex;align-items:center;justify-content:center;padding:16px;overflow-y:auto">
      <div style="width:100%;max-width:320px;background:#111827;border:1px solid #374151;border-radius:16px;overflow:hidden;box-shadow:0 25px 50px rgba(0,0,0,0.8)">
        <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid #1f2937">
          <span style="font-weight:bold;color:#fff">${deck.name}</span>
          <span style="font-size:12px;color:#6b7280">${deck.cards.length} cards</span>
          <button id="deck-list-close" style="width:28px;height:28px;border-radius:50%;background:#1f2937;border:none;color:#fff;cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center">✕</button>
        </div>
        <div style="padding:8px 16px;max-height:60vh;overflow-y:auto">${rows}</div>
      </div>
    </div>`;
}

function renderDeckSelect() {
  const decks = Object.values(DECKS);

  function deckGridHTML(owner) {
    const currentId = owner === "player" ? selectedPlayerDeck : selectedAiDeck;
    return decks.map(d => {
      const cover = CARD_POOL[d.cards[0]]?.image ?? "";
      const sel = d.id === currentId ? " selected" : "";
      return `<div class="deck-card-wrap">
        <button class="deck-card${sel}" data-id="${d.id}" data-owner="${owner}">
          <img src="${cover}" alt="${d.name}">
          <span>${d.name}</span>
        </button>
        <button class="deck-list-btn" data-deckid="${d.id}">List</button>
      </div>`;
    }).join("");
  }

  const modal = deckListViewId ? renderDeckListModal(deckListViewId) : "";

  root.innerHTML = `
    <main class="screen deck-screen">
      <section class="panel">
        <h2>Deck Select</h2>
        <div class="deck-picker">
          <p class="deck-picker-label">Your Deck</p>
          <div class="deck-grid" id="playerDeckGrid">${deckGridHTML("player")}</div>
        </div>
        <div class="deck-picker">
          <p class="deck-picker-label">AI Deck</p>
          <div class="deck-grid" id="aiDeckGrid">${deckGridHTML("ai")}</div>
        </div>
        <div class="row pt-2">
          <button id="backMenu" class="ghost p-1">Back</button>
          <button id="startGame" class="primary p-1">Begin</button>
        </div>
      </section>
    </main>${modal}`;

  document.querySelectorAll(".deck-card").forEach(btn => {
    btn.onclick = () => {
      const { id, owner } = btn.dataset;
      if (owner === "player") {
        selectedPlayerDeck = id;
        document.querySelectorAll("#playerDeckGrid .deck-card").forEach(b => b.classList.toggle("selected", b.dataset.id === id));
      } else {
        selectedAiDeck = id;
        document.querySelectorAll("#aiDeckGrid .deck-card").forEach(b => b.classList.toggle("selected", b.dataset.id === id));
      }
    };
  });

  document.querySelectorAll(".deck-list-btn").forEach(btn => {
    btn.onclick = () => { deckListViewId = btn.dataset.deckid; render(); };
  });

  document.getElementById("backMenu").onclick = () => { screen = "menu"; render(); };
  document.getElementById("startGame").onclick = () => startGame();

  const closeBtn = document.getElementById("deck-list-close");
  if (closeBtn) closeBtn.onclick = () => { deckListViewId = null; render(); };
  const backdrop = document.getElementById("deck-list-backdrop");
  if (backdrop) backdrop.onclick = (e) => { if (e.target === backdrop) { deckListViewId = null; render(); } };
}

// ─── Root render ─────────────────────────────────────────────────────────────

let _renderBlocked = false; // true while a dying-spirit animation is playing

function render() {
  if (screen === "menu") { renderMenu(); return; }
  if (screen === "deck") { renderDeckSelect(); return; }
  if (screen === "gallery") { renderCardGallery(); return; }
  if (_renderBlocked) return; // animation in progress — skip

  // Detect spirits that are about to leave the field (dying animation)
  if (game) {
    const newState = game.getState();
    const newUids = new Set();
    newState.players.forEach(p => {
      p.spirits.forEach(s => newUids.add(s.uid));
      p.nexuses.forEach(n => newUids.add(n.uid));
    });
    const dyingEls = [];
    prevSpiritUids.forEach(set => {
      set.forEach(uid => {
        if (!newUids.has(uid)) {
          const el = document.querySelector(`[data-uid="${uid}"] .spirit-chip`);
          if (el) dyingEls.push(el);
        }
      });
    });
    if (dyingEls.length > 0) {
      _renderBlocked = true;
      dyingEls.forEach(el => el.classList.add('spirit-dying'));
      setTimeout(() => { _renderBlocked = false; renderMatch(); }, 1300);
      return;
    }
  }

  renderMatch();
}

render();
