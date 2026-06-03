export const CARDS_SD06 = {
  sd06001Ohdoran: {
    id: "sd06001Ohdoran", format: "Eternal", set: "sd06",
    name: "Ohdoran", jpName: "オドラン", rarity: "Common",
    type: "spirit", color: "red", cost: 0, reduction: 0, symbols: 1, exsymbols: false,
    bp: 1000, image: "./assets/cards/SD06-001.webp", family: ["Winged Dragon"],
    levels: [
      { level: 1, cores: 1, bp: 1000 },
      { level: 2, cores: 3, bp: 3000 },
    ],
    effects: [],
  }, sd06001OhdoranRevival: {
    id: "sd06001OhdoranRevival", format: "Eternal", set: "sd06",
    name: "Ohdoran", jpName: "オドラン", rarity: "Common",
    type: "spirit", color: "red", cost: 3, reduction: {red: 1, white: 1}, symbols: 1, exsymbols: false,
    bp: 1000, image: "./assets/cards/SD56_RV001.webp", family: ["Great General", "Winged Dragon"],
    levels: [
      { level: 1, cores: 1, bp: 1000 },
      { level: 2, cores: 3, bp: 3000 },
    ],
    effects: [
        { condition: "[LV1][LV2] (When Summoned)", text: "You can reveal three cards from your decktop. Among them, add a \"Hajime\"-named card, and a \"Supreme Hero\"/\"Great General\" family card, except \"Ohdoran\", to the Hand. Discard any remaining cards." },
        { condition: "[LV1][LV2] (Your Main Step)", text: "This Spirit gains an extra White symbol." },
    ],
  },sd06002Salamantle: {
    id: "sd06002Salamantle", format: "Eternal", set: "sd06",
    name: "Salamantle", jpName: "サラマンテル", rarity: "Common",
    type: "spirit", color: "red", cost: 2, reduction: {red: 1}, symbols: 1, exsymbols: false,
    bp: 1000, image: "./assets/cards/Salamantle.webp", family: ["Lava Fish"],
    levels: [
      { level: 1, cores: 1, bp: 1000 },
      { level: 2, cores: 3, bp: 3000 },
      { level: 3, cores: 5, bp: 5000 },
    ],
    effects: [
        { condition: "[LV2][LV3] (When Attacks)", text: "Draw a card." },
    ],
  },
  sd06003OneKengo: {
    id: "sd06003OneKengo", format: "Eternal", set: "sd06",
    name: "One Kengo", jpName: "オーン・ケンゴ", rarity: "Common",
    type: "spirit", color: "red", cost: 2, reduction: {red: 1}, symbols: 1, exsymbols: false,
    bp: 4000, image: "./assets/cards/SD06-003.webp", family: ["	Emperor Beast"],
    keyword: "Clash",
    levels: [
      { level: 1, cores: 1, bp: 1000 },
      { level: 2, cores: 3, bp: 4000 },
      { level: 3, cores: 5, bp: 6000 },
    ],
    effects: [
        { condition: "[LV1][LV2][LV3]", text: "While you have a set Burst, treat this Spirit as LV3." },
        {  condition: "[LV2][LV3] Clash During Attack",text: "Opposing Spirits must block if possible.",}
    ],
  },
  sd06003OneKengoRevival: {
    id: "sd06003OneKengoRevival", format: "Eternal", set: "sd06",
    name: "One Kengo (Revival)", jpName: "オーン・ケンゴ", rarity: "Common",
    type: "spirit", color: "red", cost: 3, reduction: {red: 1, white: 1}, symbols: 1, exsymbols: false,
    bp: 2000, image: "./assets/cards/SD56_RV003.webp", family: ["Emperor Beast"],
    levels: [
      { level: 1, cores: 1, bp: 2000 },
      { level: 2, cores: 3, bp: 5000 },
      { level: 3, cores: 5, bp: 8000 },
    ],
    effects: [
        { condition: "[LV1][LV2][LV3]", text: "This Spirit's color and symbol are also treated as White." },
        { condition: "[LV1][LV2][LV3]", text: "While you have a set Burst, this Spirit is treated as being at its highest level." },
        {  condition: "[LV2][LV3] (When Attacks)",text: "You can target and attack an opposing Spirit. Also, draw a card.",}
    ],
  },
   sd06004DosMonkey: {
    id: "sd06004DosMonkey", format: "Eternal", set: "sd06",
    name: "Dos Monkey", jpName: "ドス・モンキー", rarity: "Common",
    type: "spirit", color: "red", cost: 3, reduction: {red: 2, white: 1}, symbols: 1, exsymbols: false,
    bp: 3000, image: "./assets/cards/SD06-004.webp", family: ["Emperor Beast"],
    levels: [
      { level: 1, cores: 1, bp: 3000 },
      { level: 2, cores: 3, bp: 5000 },
    ],
    effects: [
        { condition: "[LV1][LV2](Your Attack Step)", text: "While you have a set Burst, all your non-braved Spirits gain +3000 BP." },
    ],
  },sd06004DosMonkeyRevival: {
    id: "sd06004DosMonkeyRevival", format: "Eternal", set: "sd06",
    name: "Dos Monkey (Revival)", jpName: "ドス・モンキー", rarity: "Common",
    type: "spirit", color: "red", cost: 3, reduction: {red: 2, white: 1}, symbols: 1, exsymbols: false,
    bp: 3000, image: "./assets/cards/SD56_RV002.webp", family: ["Great General", "Emperor Beast"],
    levels: [
      { level: 1, cores: 1, bp: 3000 },
      { level: 2, cores: 2, bp: 5000 },
    ],
    effects: [
        { condition: "[LV1][LV2] (When Summoned)", text: "You can reveal three cards from your decktop. Among them, add a \"Hajime\"-named card, and a \"Supreme Hero\"/\"Great General\" family card, except \"Dos-Monkey\", to the Hand. Discard any remaining cards." },
        { condition: "[LV2] (Your Main Step)", text: "A Red/White Magic card with Burst effect revealed from deck by your \"Great General\" family Spirit effect can be added to the Hand." },
    ],
  }, 
  sd06005TwinBladeDragon: {
    id: "sd06005TwinBladeDragon", format: "Eternal", set: "sd06",
    name: "Twin Blade Dragon", jpName: "ツインブレード・ドラゴン", rarity: "Common",
    type: "spirit", color: "red", cost: 5, reduction: {red: 2}, symbols: 1, exsymbols: false,
    bp: 4000, image: "./assets/cards/TwinBlade-Dragon.webp", family: ["Dragon Warrior"],
    levels: [
      { level: 1, cores: 1, bp: 4000 },
      { level: 2, cores: 2, bp: 6000 },
      { level: 3, cores: 5, bp: 8000 },
    ],
    effects: [
        { condition: "[LV1][LV2][LV3] (When Attacks)", text: "Draw a card. If you have a Burst set, also, destroy an opposing 4000 BP or less Spirit." },
        { condition: "[LV2][LV3] Flash (Your Attack Step)", text: "By discarding one of your Bursts, during this turn, give one of your Spirits +5000 BP." },
    ],
  },
  sd06006IkazuchiWurm: {
    id: "sd06006IkazuchiWurm", format: "Eternal", set: "sd06",
    name: "Ikazuchi Wurm", jpName: "イカヅチ・ワーム", rarity: "Common",
    type: "spirit", color: "red", cost: 6, reduction: {red: 2}, symbols: 1, exsymbols: false,
    bp: 4000, image: "./assets/cards/Izakuchi-Wurm001.webp", family: ["Ancient Dragon"],
    levels: [
      { level: 1, cores: 1, bp: 4000 },
      { level: 2, cores: 3, bp: 7000 },
    ],
    effects: [
        { condition: "[LV1][LV2] (When Summoned)", text: "Destroy an opposing Brave/Nexus." },
        { condition: "[LV1][LV2] (When Attacks)", text: " If you have a set burst, you can target and attack an opposing Spirit." },
        { condition: "[LV2] (When Attacks)", text: "For each \"Dragon Warrior\" family Spirit you control, this Spirit gains +3000 BP." },
    ],
  },
   sd06007TheHeroDragonLordDragon: {
    id: "sd06007TheHeroDragonLordDragon", format: "Eternal", set: "sd06",
    name: "The Hero Dragon Lord-Dragon", jpName: "英雄龍ロード・ドラゴン", rarity: "Common",
    type: "spirit", color: "red", cost: 6, reduction: {red: 3}, symbols: 1, exsymbols: false,
    bp: 4000, image: "./assets/cards/SD06-007.webp", family: [	"Supreme Hero", "Dragon Warrior" ],
    keyword: "Burst",
    levels: [
      { level: 1, cores: 1, bp: 4000 },
      { level: 2, cores: 3, bp: 6000 },
      { level: 3, cores: 5, bp: 9000 },
    ],
    effects: [
        { condition: "[ Burst : After your Life is reduced ]", text: "Summon this Spirit card." },
        { condition: "[LV1][LV2][LV3] (After Your Burst Activates)", text: "If the card activated was Cost 5 or less, destroy an opposing 9000 BP or less Spirit." },
        { condition: "[LV2][LV3] (When Battles)", text: "At the end of battle, by discarding one of your Bursts, refresh this Spirit." },
    ],
  },
  sd06008Armaditokage: {
    id: "sd06008Armaditokage", format: "Eternal", set: "sd06",
    name: "Armaditokage", jpName: "アーマディトカゲ", rarity: "Common",
    type: "spirit", color: "white", cost: 1, reduction: {red: 1, white: 1}, symbols: 1, exsymbols: false,
    bp: 1000, image: "./assets/cards/Armaditokage.webp", family: ["Armored Dragon" ],
    levels: [
      { level: 1, cores: 1, bp: 1000 },
      { level: 2, cores: 2, bp: 3000 },
      { level: 3, cores: 3, bp: 4000 },
    ],
    effects: [
        { condition: "[LV1][LV2][LV3] ", text: "This Spirit is also treated as a Red Spirit." },
    ],
  },
   sd06009KijiToria: {
    id: "sd06009KijiToria", format: "Eternal", set: "sd06",
    name: "Kiji-Toria", jpName: "キジトリア", rarity: "Common",
    type: "spirit", color: "white", cost: 3, reduction: {white: 1}, symbols: 1, exsymbols: false,
    bp: 1000, image: "./assets/cards/SD06-009.webp", family: ["Machine Beast" ],
    levels: [
      { level: 1, cores: 1, bp: 3000 },
      { level: 2, cores: 2, bp: 5000 },
    ],
    effects: [
        { condition: "[LV1][LV2] (Opposing Turn)", text: "While you have a set Burst, all your non-braved Spirits gain +2000 BP." },
    ],
  },
  sd06009KijiToriaRevival: {
    id: "sd06009KijiToriaRevival", format: "Eternal", set: "sd06",
    name: "Kiji-Toria (Revival)", jpName: "キジトリア", rarity: "Common",
    type: "spirit", color: "white", cost: 3, reduction: {white: 1,red: 1}, symbols: 1, exsymbols: false,
    bp: 1000, image: "./assets/cards/SD56_RV005.webp", family: ["Great General", "Machine Beast"],
    levels: [
      { level: 1, cores: 1, bp: 3000 },
      { level: 2, cores: 2, bp: 5000 },
    ],
    effects: [
        { condition: "[LV1][LV2]", text: "This Spirit's color and symbol are also treated as Red." },
        { condition: "[LV1][LV2]", text: "While you have a set Burst, all your \"Supreme Hero\"/\"Great General\" family Spirits/Grandwalker Nexuses are unaffected by opposing Spirit/Nexus effects." },
        { condition: "[LV2] (Start of Opposing Attack Step)", text: "You can either set a card with Burst effect from your Hand, or reveal one of your Bursts and return it to the Hand." },
    ],          
  },
  sd06010TheSeaDragonCimaCreek: {
    id: "sd06007TheSeaDragonCimaCreek", format: "Eternal", set: "sd06",
    name: "The SeaDragon Cima-Creek", jpName: "海竜 シマ・クリーク", rarity: "Common",
    type: "spirit", color: "white", cost: 5, reduction: {white:3}, symbols: 1, exsymbols: false,
    bp: 4000, image: "./assets/cards/The_SeaDragon_Cima-Creek.webp", family: [	"Supreme Hero", "Armored Dragon" ],
    keyword: "Burst",
    levels: [
      { level: 1, cores: 1, bp: 4000 },
      { level: 2, cores: 3, bp: 7000 },
      { level: 3, cores: 5, bp: 8000 },
    ],
    effects: [
        { condition: "[ Burst : After your opponent activates a Spirit/Brave's (When Summoned) effect ]", text: "Summon this Spirit card." },
        { condition: "[LV1][LV2]", text: "This Spirit and Cost 2 or less Spirits cannot attack." },
        { condition: "[LV1][LV2][LV3] (Opposing Turn)", text: "Each opposing Spirit can only reduce your Life by one each turn." },
    ],
  },
   sd06011TheHeroEmperorDeitySword: {
    id: "sd06011TheHeroEmperorDeitySword", format: "Eternal", set: "sd06",
    name: "The Hero-Emperor Deity-Sword", jpName: "英雄皇帝 神剣", rarity: "Common",
    type: "nexus", color: "red", cost: 3, reduction: {red: 2}, symbols: 1, exsymbols: false,
    bp: 1000, image: "./assets/cards/SD06-011.webp", family: [],
    levels: [
      { level: 1, cores: 0 },
      { level: 2, cores: 2 },
    ],
    effects: [
        { condition: "[LV1][LV2]", text: "When you set Burst, draw a card. This effect can only be used once per turn." },
        { condition: "[LV2] (Your Attack Step)", text: "Each non-braved \"Supreme Hero\" family Spirit you control gains +3000 BP. Also, while you have a Burst set, each non-braved \"Supreme Hero\" family Spirit you control gains +5000 BP." },
    ],
  },
   sd06011TheHeroEmperorDeitySwordRevival: {
    id: "sd06011TheHeroEmperorDeitySwordRevival", format: "Eternal", set: "sd06",
    name: "The Hero-Emperor Deity-Sword (Revival)", jpName: "英雄皇帝 神剣 (復活)", rarity: "Common",
    type: "nexus", color: "red", cost: 3, reduction: {red: 1,white: 1}, symbols: 1, exsymbols: false,
    bp: 1000, image: "./assets/cards/SD56_RV006.webp", family: [],
    levels: [
      { level: 1, cores: 0 },
      { level: 2, cores: 2 },
    ],
    effects: [
        { condition: "[LV1][LV2]", text: "When you set Burst, either destroy an opposing 7000 BP or less Spirit, or draw a card. This effect can only be used once per turn." },
        { condition: "[LV2]", text: "Each Spirit you control gains +3000 BP. Also, while your \"Supreme Hero\"/\"Great General\" family Spirit is attacking, the opponent cannot end the Attack Step via effects." },
    ],
  },
  sd06012TheHeroEmperorDeityShield: {
    id: "sd06012TheHeroEmperorDeityShield", format: "Eternal", set: "sd06",
    name: "The Hero-Emperor Deity-Shield", jpName: "英雄皇帝 神盾", rarity: "Common",
    type: "nexus", color: "white", cost: 3, reduction: {white: 1}, symbols: 1, exsymbols: false,
    bp: 1000, image: "./assets/cards/SD06-012.webp", family: [],
    levels: [
      { level: 1, cores: 0 },
      { level: 2, cores: 3 },
    ],
    effects: [
        { condition: "[LV1][LV2] (Either Attack Step)", text: "At the beginning of the step, target an opposing Brave Spirit. During this turn, that Brave Spirit can't battle." },
        { condition: "[LV2]", text: "While you have a set Burst, all your \"HeroEmperor\"-named Nexuses can't be destroyed." },
    ],
  },
   sd06012TheHeroEmperorDeityShieldRevival: {
    id: "sd06012TheHeroEmperorDeityShieldRevival", format: "Eternal", set: "sd06",
    name: "The Hero-Emperor Deity-Shield (Revival)", jpName: "英雄皇帝 神盾 (復活)", rarity: "Common",
    type: "nexus", color: "white", cost: 3, reduction: {white: 1,red: 1}, symbols: 1, exsymbols: false,
    bp: 1000, image: "./assets/cards/SD56_RV007.webp", family: [],
    levels: [
      { level: 1, cores: 0 },
      { level: 2, cores: 1 },
    ],
    effects: [
        { condition: "[LV1][LV2]", text: "This Nexus's color and symbol are also treated as Red." },
        { condition: "[LV2]", text: "Your set \"Supreme Hero\"/\"Great General\" family Burst is unaffected by opposing effects. Also, while you have a set Burst, your \"Supreme Hero\" family Nexuses/Grandwalker Nexuses can't be destroyed." },
    ],
  },
  sd06013BurstDraw: {
    id: "sd06013BurstDraw", format: "Eternal", set: "sd06",
    name: "Burst Draw", jpName: "バーストドロー", rarity: "Common",
    type: "magic", color: "red", cost: 4, reduction: {red: 2}, symbols: 0, exsymbols: false,
    bp: 0, image: "./assets/cards/SD06-013.webp", family: [],
    keyword: "Burst",
    levels: [],
    effects: [
      { condition: "[ Burst: After an opposing Spirit/Brave's (When Summoned) effect resolves ]", text: "Draw two cards. Then by paying the cost, activate this card's Main effect." },
      { condition: "Main", text: "Draw two cards." }
      ,
    ],
  },
  sd06014BurstCross: {
    id: "sd06014BurstCross", format: "Eternal", set: "sd06",
    name: "Burst Cross", jpName: "バーストクロス", rarity: "Common",
    type: "magic", color: "red", cost: 5, reduction: {red: 3}, symbols: 0, exsymbols: false,
    bp: 0, image: "./assets/cards/SD06-014.webp", family: [],
    keyword: "Burst",
    levels: [],
    effects: [
      { condition: "[ Burst: After an opposing Spirit/Brave's (When Summoned) effect resolves ]", text: "Destroy an opposing 6000 BP or less Spirit, a Brave on an opposing Brave Spirit, and an opposing Nexus. Then, by paying the cost, activate this card's Main effect." },
      { condition: "Main", text: "Return a card with Burst effect from your Trash to the Hand." }
      ,
    ],
  },
  sd06014BurstCrossRevival: {
    id: "sd06014BurstCrossRevival", format: "Eternal", set: "sd06",
    name: "Burst Cross (Revival)", jpName: "バーストクロス (復活)", rarity: "Common",
    type: "magic", color: "red", cost: 4, reduction: {red: 2}, symbols: 0, exsymbols: false,
    bp: 0, image: "./assets/cards/BS44-RV007.webp", family: [],
    keyword: "Burst",
    levels: [],
    effects: [
      { condition: "[ Burst: After an opposing Spirit/Brave's (When Summoned) effect resolves ]", text: "Destroy an opposing 10000 BP or less Spirit, an opposing 20000 BP or less Ultimate, an opposing Brave, and an opposing Nexus. Then, by paying the cost, activate this card's Main effect." },
      { condition: "Main", text: "Return a card with Burst effect, or a Red Grandwalker Nexus card from your Trash to the Hand." }
      ,
    ],
  },
  sd06015BurstFlame: {
    id: "sd06015BurstFlame", format: "Eternal", set: "sd06",
    name: "Burst Flame", jpName: "バーストフレイム", rarity: "Common",
    type: "magic", color: "red", cost: 6, reduction: {red: 6}, symbols: 0, exsymbols: false,
    bp: 0, image: "./assets/cards/SD06-015.webp", family: [],
    keyword: "Burst",
    levels: [],
    effects: [
      { condition: "[ Burst: After your Life is reduced ]", text: "Destroy three opposing 4000 BP or less Spirits. Then, by paying the cost, activate this card's Flash effect." },
      { condition: "Flash", text: "Destroy an opposing Brave Spirit." }
      ,
    ],
  },
  sd06015BurstFlameRevival: {
    id: "sd06015BurstFlameRevival", format: "Eternal", set: "sd06",
    name: "Burst Flame (Revival)", jpName: "バーストフレイム (復活)", rarity: "Common",
    type: "magic", color: "red", cost: 6, reduction: {red: 6}, symbols: 0, exsymbols: false,
    bp: 0, image: "./assets/cards/SD56_RV008.webp", family: [],
    keyword: "Burst",
    levels: [],
    effects: [
      { condition: "Trash", text: "This card in Trash is unaffected by any effects." },
      { condition: "Hand", text: "This card in your Hand is unaffected by opposing effects, and when your Life is reduced by the opponent, it can be used without paying the cost." },
      { condition: "[ Burst: After an opposing Spirit/Ultimate attacks ]", text: "Destroy three opposing 12000 BP or less Spirits/Ultimates. Then, by paying the cost, activate this card's Flash effect." },
      { condition: "Flash", text: "Destroy an opposing Brave Spirit/Brave Ultimate, or destroy an opposing 20000 BP or less Spirit/Ultimate." }
      ,
    ],
  },
   sd06016BurstWall: {
    id: "sd06016BurstWall", format: "Eternal", set: "sd06",
    name: "Burst Wall", jpName: "バーストウォール", rarity: "Common",
    type: "magic", color: "white", cost: 4, reduction: {white: 1}, symbols: 0, exsymbols: false,
    bp: 0, image: "./assets/cards/SD06-016_HD.webp", family: [],
    keyword: "Burst",
    levels: [],
    effects: [
      { condition: "[ Burst: After your Life is reduced ]", text: "Put a core from the Void to your Life. Then by paying the cost, activate this card's Flash effect." },
      { condition: "Flash", text: "When this battle ends, end the Attack Step." }
      ,
    ],
  },
  sd06016BurstWallRevival: {
    id: "sd06016BurstWallRevival", format: "Eternal", set: "sd06",
    name: "Burst Wall (Revival)", jpName: "バーストウォール (復活)", rarity: "Common",
    type: "magic", color: "white", cost: 4, reduction: {white: 1}, symbols: 0, exsymbols: false,
    bp: 0, image: "./assets/cards/SD56_RV009.webp", family: [],
    keyword: "Burst",
    levels: [],
    effects: [
      { condition: "Trash", text: "This card in Trash is unaffected by any effects." },
      { condition: "Hand", text: "This card in your Hand is unaffected by opposing effects, and when your Life is reduced by the opponent, it can be used without paying the cost." },
      { condition: "[ Burst: After your Life is reduced ]", text: "Put a core from the Void to your Life. Then by paying the cost, activate this card's Flash effect." },
      { condition: "Flash", text: "When this battle ends, end the Attack Step." }
      ,
    ],
  },
    sd06017BurstStorm: {
    id: "sd06017BurstStorm", format: "Eternal", set: "sd06",
    name: "Burst Storm", jpName: "バーストストーム", rarity: "Common",
    type: "magic", color: "white", cost: 5, reduction: {white: 3}, symbols: 0, exsymbols: false,
    bp: 0, image: "./assets/cards/SD06-017.webp", family: [],
    keyword: "Burst",
    levels: [],
    effects: [
      { condition: "[ Burst: After an opposing Spirit/Brave's (When Summoned) effect resolves ]", text: "Return an opposing Spirit/Brave/Nexus to the deckbottom. Then, by paying the cost, activate this card's Flash effect." },
      { condition: "Flash", text: "Refresh a Spirit you control." }
      ,
    ],
  },sd06017BurstStormRevival: {
    id: "sd06017BurstStormRevival", format: "Eternal", set: "sd06",
    name: "Burst Storm (Revival)", jpName: "バーストストーム (復活)", rarity: "Common",
    type: "magic", color: "white", cost: 5, reduction: {white: 3}, symbols: 0, exsymbols: false,
    bp: 0, image: "./assets/cards/SD56_RV010.webp", family: [],
    keyword: "Burst",
    levels: [],
    effects: [
      { condition: "Field", text: "This set card can't be discarded by the opponent." },
      { condition: "[ Burst: After an opposing Spirit's (When Summoned/Advents) effect resolves ]", text: "Return an opposing Spirit/Ultimate/Nexus to the deckbottom. Also, destroy an opposing non-\"Primal\" family Grandwalker Nexus, and during this game, all non-\"Primal\" family Grandwalker Nexus cards in the opposing Trash are unaffected by any effects except this effect, and can't activate their effects. Then, by paying the cost, activate this card's Flash effect." },
      { condition: "Flash", text: "Refresh a Spirit you control." }
      ,
    ],
  },
} 