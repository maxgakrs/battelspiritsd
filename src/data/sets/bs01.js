// Set: BS01 (Eternal) — game stats (cost/bp/levels/effects) are stubs, fill as needed
export const CARDS_BS01 = {
  bs01001Goradon: {
    id: "bs01001Goradon", format: "Eternal", set: "bs01",
    name: "Goradon", jpName: "ゴラドン", rarity: "Common",
    type: "spirit", color: "red", cost: 0, reduction: 0, symbols: 1, exsymbols: false,
    bp: 1000, image: "./assets/cards/BS01-001.jpg", family: ["Reptile Beast"],
    levels: [
      { level: 1, cores: 1, bp: 1000 },
      { level: 2, cores: 3, bp: 3000 },
    ],
    effects: [],
  },
  bs01001GoradonRevival: {
    id: "bs01001GoradonRevival", format: "Eternal", set: "bs01",
    name: "Goradon (Revival)", jpName: "ゴラドン", rarity: "Common",
    type: "spirit", color: "red", cost: 0, reduction: 0, symbols: 1, exsymbols: false,
    bp: 2000, image: "./assets/cards/BSC22-001.jpg", family: ["Reptile Beast"],
    levels: [
      { level: 1, cores: 1, bp: 2000 },
      { level: 2, cores: 3, bp: 5000 },
    ],
    effects: [],
  },
  bs01002Rokceratops: {
    id: "bs01002Rokceratops", format: "Eternal", set: "bs01",
    name: "Rokceratops", jpName: "ロクケラトプス", rarity: "Common",
    type: "spirit", color: "red", cost: 1, reduction: 1, symbols: 1, exsymbols: false,
    bp: 1000, image: "./assets/cards/BS01-002.jpg", family: ["Terra Dragon"],
    levels: [
      { level: 1, cores: 1, bp: 1000 },
      { level: 2, cores: 2, bp: 3000 },
      { level: 3, cores: 3, bp: 4000 },
    ],
    effects: [],
  },
  bs01002RokceratopsRevival: {
    id: "bs01002RokceratopsRevival", format: "Eternal", set: "bs01",
    name: "Rokceratops (Revival)", jpName: "ロクケラトプス", rarity: "Common",
    type: "spirit", color: "red", cost: 1, reduction: 1, symbols: 1, exsymbols: false,
    bp: 3000, image: "./assets/cards/BSC22-002.jpg", family: ["Terra Dragon"],
    levels: [
      { level: 1, cores: 1, bp: 3000 },
      { level: 2, cores: 2, bp: 5000 },
      { level: 3, cores: 3, bp: 6000 },
    ],
    effects: [],
  },
  bs01003Teranosaber: {
    id: "bs01003Teranosaber", format: "Eternal", set: "bs01",
    name: "Teranosaber", jpName: "テラノセイバー", rarity: "Common",
    type: "spirit", color: "red", cost: 2, reduction: 0, symbols: 1, exsymbols: false,
    bp: 4000, image: "./assets/cards/Teranosaber1.webp", family: ["Flying Fang"],
    levels: [
      { level: 1, cores: 1, bp: 4000 },
      { level: 2, cores: 3, bp: 6000 },
    ],
    effects: [
      { condition: "[LV1] (During Opponent's Battle Phase)", text: "This spirit cannot block." },
    ],
  },
  bs01003TeranosaberRevival: {
    id: "bs01003TeranosaberRevival", format: "Eternal", set: "bs01",
    name: "Teranosaber (Revival)", jpName: "テラノセイバー", rarity: "Common",
    type: "spirit", color: "red", cost: 2, reduction: 0, symbols: 1, exsymbols: false,
    bp: 8000, image: "./assets/cards/Teranosaber1.webp", family: ["Flying Fang"],
    levels: [
      { level: 1, cores: 1, bp: 8000 },
      { level: 2, cores: 3, bp: 11000 },
    ],
    effects: [
      { condition: "[LV1][LV2] (Opposing Attack Step)", text: "This Spirit cannot block opposing Spirits." },
    ],
  },
  bs01004TheScoutDragno: {
    id: "bs01004TheScoutDragno", format: "Eternal", set: "bs01",
    name: "The Scout Dragno", jpName: "ドラグノ偵察兵", rarity: "Common",
    type: "spirit", color: "red", cost: 2, reduction: 1, symbols: 1, exsymbols: false,
    bp: 2000, image: "./assets/cards/Scoutdragno1.webp", family: ["Dragon"],
    levels: [
      { level: 1, cores: 1, bp: 2000 },
      { level: 2, cores: 2, bp: 3000 },
    ],
    effects: [
      { condition: "[LV1][LV2] (When Attacks)", text: "This spirit gets +2000BP until end of turn." },
    ],
  },
  bs01004TheScoutDragnoRevival: {
    id: "bs01004TheScoutDragnoRevival", format: "Eternal", set: "bs01",
    name: "The Scout Dragno (Revival)", jpName: "ドラグノ偵察兵", rarity: "Common",
    type: "spirit", color: "red", cost: 2, reduction: 1, symbols: 1, exsymbols: false,
    bp: 2000, image: "./assets/cards/Scoutdragno1.webp", family: ["Dragon"],
    levels: [
      { level: 1, cores: 1, bp: 2000 },
      { level: 2, cores: 2, bp: 3000 },
    ],
    effects: [
      { condition: "[LV1][LV2] (When Attacks)", text: "This spirit gets +5000 BP." },
    ],
  },
  bs01005Eyeburn: {
    id: "bs01005Eyeburn", format: "Eternal", set: "bs01",
    name: "Eyeburn", jpName: "アイバーン", rarity: "Common",
    type: "spirit", color: "red", cost: 2, reduction: 1, symbols: 1, exsymbols: false,
    bp: 2000, image: "./assets/cards/BS01-005.jpg", family: ["Winged Dragon"],
    levels: [
      { level: 1, cores: 1, bp: 2000 },
      { level: 2, cores: 4, bp: 6000 },
    ],
    effects: [],
  },
  bs01005EyeburnRevival: {
    id: "bs01005EyeburnRevival", format: "Eternal", set: "bs01",
    name: "Eyeburn (Revival)", jpName: "アイバーン", rarity: "Common",
    type: "spirit", color: "red", cost: 2, reduction: 1, symbols: 1, exsymbols: false,
    bp: 5000, image: "./assets/cards/BSC22-005.jpg", family: ["Winged Dragon"],
    levels: [
      { level: 1, cores: 1, bp: 5000 },
      { level: 2, cores: 4, bp: 10000 },
    ],
    effects: [],
  },
  bs01006Merat: {
    id: "bs01006Merat", format: "Eternal", set: "bs01",
    name: "Merat", jpName: "メラット", rarity: "Common",
    type: "spirit", color: "red", cost: 2, reduction: 2, symbols: 1, exsymbols: false,
    bp: 3000, image: "./assets/cards/Merat1.webp", family: ["Drifting Spirit"],
    levels: [
      { level: 1, cores: 1, bp: 3000 },
      { level: 2, cores: 3, bp: 6000 },
    ],
    effects: [
      { condition: "[LV1][LV2] (Your Start Step)", text: "Move 1 core from this spirit to your Reserve." },
      { condition: "[LV1][LV2] (Permanent)", text: "Each time 1 or more cores are put on this spirit except due to the effect of a spirit, nexus or magic, this spirit cannot attack this turn." },
    ],
  },
  bs01006MeratRevival: {
    id: "bs01006MeratRevival", format: "Eternal", set: "bs01",
    name: "Merat (Revival)", jpName: "メラット", rarity: "Common",
    type: "spirit", color: "red", cost: 2, reduction: 2, symbols: 1, exsymbols: false,
    bp: 3000, image: "./assets/cards/Merat1.webp", family: ["Drifting Spirit"],
    levels: [
      { level: 1, cores: 1, bp: 3000 },
      { level: 2, cores: 3, bp: 6000 },
    ],
    effects: [
      { condition: "[LV1][LV2] (Your Start Step)", text: "Move 1 core from this spirit to your Reserve. When this spirit is depleted, destroy one opposing Spirit or Ultimate with 12000 BP or less." },
      { condition: "[LV1][LV2]", text: "When 1 or more cores are put onto this Spirit except due to your effects, this Spirit cannot attack that turn." },
    ],
  },
  bs01007Hummerdrake: {
    id: "bs01007Hummerdrake", format: "Eternal", set: "bs01",
    name: "Hummerdrake", jpName: "ハンマドレイク", rarity: "Common",
    type: "spirit", color: "red", cost: 2, reduction: 2, symbols: 1, exsymbols: false,
    bp: 4000, image: "./assets/cards/BS01-007.jpg", family: ["Terra Dragon"],
    levels: [
      { level: 1, cores: 1, bp: 4000 },
      { level: 2, cores: 2, bp: 5000 },
      { level: 3, cores: 7, bp: 9000 },
    ],
    effects: [
      { condition: "[LV1][LV2][LV3] (When Summoned)", text: "Send a core from your Field or your Trash to the Void." },
    ],
  },
  bs01007HummerdrakeRevival: {
    id: "bs01007HummerdrakeRevival", format: "Eternal", set: "bs01",
    name: "Hummerdrake (Revival)", jpName: "ハンマドレイク", rarity: "Common",
    type: "spirit", color: "red", cost: 2, reduction: 2, symbols: 1, exsymbols: false,
    bp: 10000, image: "./assets/cards/BSC22-007.jpg", family: ["Terra Dragon"],
    levels: [
      { level: 1, cores: 1, bp: 10000 },
      { level: 2, cores: 2, bp: 13000 },
      { level: 3, cores: 7, bp: 20000 },
    ],
    effects: [
      { condition: "[LV1][LV2][LV3] (When Summoned)", text: "Send a core from your Field/Trash to the Void." },
    ],
  },
  bs01008Metalburn: {
    id: "bs01008Metalburn", format: "Eternal", set: "bs01",
    name: "Metalburn", jpName: "メタルバーン", rarity: "Common",
    type: "spirit", color: "red", cost: 3, reduction: 1, symbols: 1, exsymbols: false,
    bp: 3000, image: "./assets/cards/BS01-008.jpg", family: ["Machine Dragon"],
    levels: [
      { level: 1, cores: 1, bp: 3000 },
      { level: 2, cores: 3, bp: 4000 },
      { level: 3, cores: 8, bp: 8000 },
    ],
    effects: [],
  },
  bs01008MetalburnRevival: {
    id: "bs01008MetalburnRevival", format: "Eternal", set: "bs01",
    name: "Metalburn (Revival)", jpName: "メタルバーン", rarity: "Common",
    type: "spirit", color: "red", cost: 3, reduction: 1, symbols: 1, exsymbols: false,
    bp: 7000, image: "./assets/cards/BSC22-008.jpg", family: ["Machine Dragon"],
    levels: [
      { level: 1, cores: 1, bp: 7000 },
      { level: 2, cores: 3, bp: 9000 },
      { level: 3, cores: 8, bp: 18000 },
    ],
    effects: [],
  },
  bs01009VolcBaboon: {
    id: "bs01009VolcBaboon", format: "Eternal", set: "bs01",
    name: "Volc-Baboon", jpName: "ヴォルク・バブーン", rarity: "Common",
    type: "spirit", color: "red", cost: 3, reduction: 1, symbols: 1, exsymbols: false,
    bp: 4000, image: "./assets/cards/Volc-baboon1.webp", family: ["Emperor Beast"],
    levels: [
      { level: 1, cores: 1, bp: 4000 },
      { level: 2, cores: 3, bp: 6000 },
    ],
    effects: [
      { condition: "[LV1][LV2] (During Opponent's Battle Phase)", text: "This spirit cannot block." },
    ],
  },
  bs01009VolcBaboonRevival: {
    id: "bs01009VolcBaboonRevival", format: "Eternal", set: "bs01",
    name: "Volc-Baboon (Revival)", jpName: "ヴォルク・バブーン", rarity: "Common",
    type: "spirit", color: "red", cost: 3, reduction: 1, symbols: 1, exsymbols: false,
    bp: 10000, image: "./assets/cards/Volc-baboon1.webp", family: ["Emperor Beast"],
    levels: [
      { level: 1, cores: 1, bp: 10000 },
      { level: 2, cores: 3, bp: 14000 },
    ],
    effects: [
      { condition: "[LV1][LV2] (Opposing Attack Step)", text: "This spirit cannot block opposing Spirits." },
    ],
  },
  bs01010Chakrambat: {
    id: "bs01010Chakrambat", format: "Eternal", set: "bs01",
    name: "Chakrambat", jpName: "チャクラムバット", rarity: "Common",
    type: "spirit", color: "red", cost: 3, reduction: 2, symbols: 1, exsymbols: false,
    bp: 1000, image: "./assets/cards/Chakrambat1.webp", family: ["Flying Fang"],
    levels: [
      { level: 1, cores: 1, bp: 1000 },
      { level: 2, cores: 2, bp: 2000 },
    ],
    effects: [
      { condition: "[LV1][LV2] (When Attacks)", text: "This spirit gets +4000BP until end of turn." },
    ],
  },
  bs01010ChakrambatRevival: {
    id: "bs01010ChakrambatRevival", format: "Eternal", set: "bs01",
    name: "Chakrambat (Revival)", jpName: "チャクラムバット", rarity: "Common",
    type: "spirit", color: "red", cost: 3, reduction: 2, symbols: 1, exsymbols: false,
    bp: 1000, image: "./assets/cards/Chakrambat1.webp", family: ["Flying Fang"],
    levels: [
      { level: 1, cores: 1, bp: 1000 },
      { level: 2, cores: 2, bp: 2000 },
    ],
    effects: [
      { condition: "[LV1][LV2] (When Attacks)", text: "This spirit gains +4000 BP. If Soul Core is on this Spirit, also draw one card from your deck." },
    ],
  },
  bs01011Dragsaurus: {
    id: "bs01011Dragsaurus", format: "Eternal", set: "bs01",
    name: "Dragsaurus", jpName: "ドラグサウルス", rarity: "Uncommon",
    type: "spirit", color: "red", cost: 3, reduction: 3, symbols: 1, exsymbols: false,
    bp: 1000, image: "./assets/cards/Dragsaurus1.webp", family: ["Reptile Beast"],
    levels: [
      { level: 1, cores: 1, bp: 1000 },
      { level: 2, cores: 2, bp: 3000 },
      { level: 3, cores: 4, bp: 5000 },
    ],
    effects: [
      { condition: "[LV1][LV2][LV3] (When Summoned)", text: "Destroy target nexus." },
    ],
  },
  bs01011DragsaurusRevival: {
    id: "bs01011DragsaurusRevival", format: "Eternal", set: "bs01",
    name: "Dragsaurus (Revival)", jpName: "ドラグサウルス", rarity: "Uncommon",
    type: "spirit", color: "red", cost: 3, reduction: 3, symbols: 1, exsymbols: false,
    bp: 1000, image: "./assets/cards/Dragsaurus1.webp", family: ["Reptile Beast"],
    levels: [
      { level: 1, cores: 1, bp: 1000 },
      { level: 2, cores: 2, bp: 3000 },
      { level: 3, cores: 4, bp: 5000 },
    ],
    effects: [
      { condition: "[LV1][LV2][LV3] (When Summoned)", text: "Destroy an opposing Nexus. While Soul Core is on your Spirit, also destroy an opposing Spirit with 3000 BP or less." },
    ],
  },
  bs01012Tryswordon: {
    id: "bs01012Tryswordon", format: "Eternal", set: "bs01",
    name: "Tryswordon", jpName: "トライソードン", rarity: "Common",
    type: "spirit", color: "red", cost: 4, reduction: 2, symbols: 1, exsymbols: false,
    bp: 1000, image: "./assets/cards/BS01-012.jpg", family: ["Terra Dragon"],
    levels: [
      { level: 1, cores: 1, bp: 1000 },
      { level: 2, cores: 4, bp: 7000 },
    ],
    effects: [
      { condition: "[LV2] (Opposing Attack Step)", text: "This Spirit can't block Spirits with BP inferior to this Spirit's." },
    ],
  },
  bs01012TryswordonRevival: {
    id: "bs01012TryswordonRevival", format: "Eternal", set: "bs01",
    name: "Tryswordon (Revival)", jpName: "トライソードン", rarity: "Common",
    type: "spirit", color: "red", cost: 4, reduction: 2, symbols: 1, exsymbols: false,
    bp: 3000, image: "./assets/cards/BSC22-012.jpg", family: ["Terra Dragon"],
    levels: [
      { level: 1, cores: 1, bp: 3000 },
      { level: 2, cores: 4, bp: 7000 },
    ],
    effects: [
      { condition: "[LV1]", text: "While Soul Core is on this Spirit, all your \"Terra Dragon\" family Spirits gain +5000 BP." },
      { condition: "[LV2] (Opposing Attack Step)", text: "This Spirit can't block Spirits with BP inferior to this Spirit's." },
    ],
  },
  bs01013Taurusknight: {
    id: "bs01013Taurusknight", format: "Eternal", set: "bs01",
    name: "Taurusknight", jpName: "タウロスナイト", rarity: "Common",
    type: "spirit", color: "red", cost: 4, reduction: 2, symbols: 1, exsymbols: false,
    bp: 3000, image: "./assets/cards/BS01-013.jpg", family: ["Mounted Warrior"],
    levels: [
      { level: 1, cores: 1, bp: 3000 },
      { level: 2, cores: 3, bp: 5000 },
      { level: 3, cores: 6, bp: 9000 },
    ],
    effects: [
      { condition: "[LV1][LV2][LV3] Flash - Awaken", text: "You can send any number of cores from your Spirits to this Spirit." },
    ],
  },
  bs01013TaurusknightRevival: {
    id: "bs01013TaurusknightRevival", format: "Eternal", set: "bs01",
    name: "Taurusknight (Revival)", jpName: "タウロスナイト", rarity: "Common",
    type: "spirit", color: "red", cost: 4, reduction: 2, symbols: 1, exsymbols: false,
    bp: 3000, image: "./assets/cards/BSC22-013.jpg", family: ["Mounted Warrior"],
    levels: [
      { level: 1, cores: 1, bp: 3000 },
      { level: 2, cores: 3, bp: 5000 },
      { level: 3, cores: 6, bp: 9000 },
    ],
    effects: [
      { condition: "[LV1][LV2][LV3] Flash - Awaken", text: "You can send any number of cores from your Spirits to this Spirit." },
      { condition: "[LV2][LV3] (Either Attack Step)", text: "Once per turn, when Soul Core is put on this Spirit via Awaken, destroy an opposing Nexus." },
    ],
  },
  bs01014TheShamanDragno: {
    id: "bs01014TheShamanDragno", format: "Eternal", set: "bs01",
    name: "The Shaman Dragno", jpName: "ドラグノ祈祷師", rarity: "Rare",
    type: "spirit", color: "red", cost: 4, reduction: 2, symbols: 1, exsymbols: false,
    bp: 2000, image: "./assets/cards/BS01-014.webp", family: ["Dragon"],
    levels: [ 
      { level: 1, cores: 1, bp: 2000 },
      { level: 2, cores: 4, bp: 5000 }
    ], effects: [
      { condition: "[LV1][LV2] (When Summoned)", text: "You can return a card from your Trash to your hand." },
    ],
  }, bs01014TheShamanDragnoRevival: {
    id: "bs01014TheShamanDragnoRevival", format: "Eternal", set: "bs01",
    name: "The Shaman Dragno (Revival)", jpName: "ドラグノ祈祷師", rarity: "Rare",
    type: "spirit", color: "red", cost: 4, reduction: 2, symbols: 1, exsymbols: false,
    bp: 2000, image: "./assets/cards/BSC22-014.webp", family: ["Dragon"],
    levels: [ 
      { level: 1, cores: 1, bp: 2000 },
      { level: 2, cores: 4, bp: 5000 }
    ], effects: [
      { condition: "[LV1][LV2] (When Summoned)", text: "Return a Spirit card from your Trash to the Hand. If Soul Core is used to pay the cost, instead, you can summon an \"/Ancient Dragon\" family Spirit card from your Trash, without paying the cost." },
    ],
  },
  bs01015Spinoaxe: {
    id: "bs01015Spinoaxe", format: "Eternal", set: "bs01",
    name: "Spinoaxe", jpName: "スピノアックス", rarity: "Common",
    type: "spirit", color: "red", cost: 4, reduction: 2, symbols: 1, exsymbols: false,
    bp: 3000, image: "./assets/cards/Spinoaxe1.webp", family: ["Terra Dragon"],
    levels: [
      { level: 1, cores: 1, bp: 3000 },
      { level: 2, cores: 3, bp: 4000 },
    ],
    effects: [
      { condition: "[LV1][LV2] (When Attacks)", text: "This spirit cannot be blocked by spirits with High Speed this turn." },
    ],
  },
  bs01015SpinoaxeRevival: {
    id: "bs01015SpinoaxeRevival", format: "Eternal", set: "bs01",
    name: "Spinoaxe (Revival)", jpName: "スピノアックス", rarity: "Common",
    type: "spirit", color: "red", cost: 4, reduction: 2, symbols: 1, exsymbols: false,
    bp: 3000, image: "./assets/cards/Spinoaxe1R.jpg", family: ["Terra Dragon"],
    levels: [
      { level: 1, cores: 1, bp: 3000 },
      { level: 2, cores: 3, bp: 4000 },
    ],
    effects: [
      { condition: "[LV1][LV2] (When Attacks)", text: "By moving Soul Core from this Spirit to the Trash, this Spirit cannot be blocked by opposing Spirits with printed effects." },
    ],
  },
  bs01016SkeltonJaw: {
    id: "bs01016SkeltonJaw", format: "Eternal", set: "bs01",
    name: "Skelton-Jaw", jpName: "スケルトン・ジョウ", rarity: "Uncommon",
    type: "spirit", color: "red", cost: 5, reduction: 2, symbols: 1, exsymbols: false,
    bp: 5000, image: "./assets/cards/BS01-016.jpg", family: ["Winged Dragon"],
    levels: [
      { level: 1, cores: 1, bp: 5000 },
      { level: 2, cores: 2, bp: 7000 },
      { level: 3, cores: 7, bp: 10000 },
    ],
    effects: [
      { condition: "[LV1][LV2][LV3] (Opposing Attack Step)", text: "This Spirit can't block opposing Spirits." },
      { condition: "[LV2][LV3] (When Attacks)", text: "For each opposing Spirit in refreshed state, this Spirit gains +1000 BP." },
    ],
  },
  bs01016SkeltonJawRevival: {
    id: "bs01016SkeltonJawRevival", format: "Eternal", set: "bs01",
    name: "Skelton-Jaw (Revival)", jpName: "スケルトン・ジョウ", rarity: "Uncommon",
    type: "spirit", color: "red", cost: 5, reduction: 2, symbols: 1, exsymbols: false,
    bp: 10000, image: "./assets/cards/BSC22-016.jpg", family: ["Winged Dragon"],
    levels: [
      { level: 1, cores: 1, bp: 10000 },
      { level: 2, cores: 2, bp: 15000 },
      { level: 3, cores: 7, bp: 20000 },
    ],
    effects: [
      { condition: "[LV1][LV2][LV3] (Opposing Attack Step)", text: "This Spirit can't block opposing Spirits." },
      { condition: "[LV2][LV3] (When Attacks)", text: "When comparing BP, for each Spirit the opponent controls, this Spirit gains +2000 BP." },
    ],
  },
  bs01017Lanceraptor: {
    id: "bs01017Lanceraptor", format: "Eternal", set: "bs01",
    name: "Lanceraptor", jpName: "ランスラプトル", rarity: "Common",
    type: "spirit", color: "red", cost: 5, reduction: 2, symbols: 1, exsymbols: false,
    bp: 2000, image: "./assets/cards/BS01-017.jpg", family: ["Terra Dragon"],
    levels: [
      { level: 1, cores: 1, bp: 2000 },
      { level: 2, cores: 2, bp: 4000 },
    ],
    effects: [
      { condition: "[LV1][LV2] (When Summoned)", text: "You can destroy a 2000 BP or less Spirit." },
    ],
  },
  bs01017LanceraptorRevival: {
    id: "bs01017LanceraptorRevival", format: "Eternal", set: "bs01",
    name: "Lanceraptor (Revival)", jpName: "ランスラプトル", rarity: "Common",
    type: "spirit", color: "red", cost: 5, reduction: 2, symbols: 1, exsymbols: false,
    bp: 2000, image: "./assets/cards/BSC22-017.jpg", family: ["Terra Dragon"],
    levels: [
      { level: 1, cores: 1, bp: 2000 },
      { level: 2, cores: 2, bp: 4000 },
    ],
    effects: [
      { condition: "[LV1][LV2] (When Summoned)", text: "Destroy an opposing 2000 BP or less Spirit. If Soul Core was used to pay the cost, instead, destroy an opposing 10000 BP or less Spirit." },
    ],
  },
  bs01018Lizardman: {
    id: "bs01018Lizardman", format: "Eternal", set: "bs01",
    name: "Lizardman", jpName: "リザードマン", rarity: "Common",
    type: "spirit", color: "red", cost: 5, reduction: 3, symbols: 1, exsymbols: false,
    bp: 4000, image: "./assets/cards/BS01-018.jpg", family: ["Reptile Beast"],
    levels: [
      { level: 1, cores: 1, bp: 4000 },
      { level: 2, cores: 2, bp: 6000 },
      { level: 3, cores: 5, bp: 9000 },
    ],
    effects: [
      { condition: "[LV1][LV2][LV3] (Opposing Attack Step)", text: "This Spirit can't block Spirits with BP inferior to this Spirit's." },
    ],
  },
  bs01018LizardmanRevival: {
    id: "bs01018LizardmanRevival", format: "Eternal", set: "bs01",
    name: "Lizardman (Revival)", jpName: "リザードマン", rarity: "Common",
    type: "spirit", color: "red", cost: 5, reduction: 3, symbols: 1, exsymbols: false,
    bp: 4000, image: "./assets/cards/BSC22-018.jpg", family: ["Reptile Beast"],
    levels: [
      { level: 1, cores: 1, bp: 4000 },
      { level: 2, cores: 2, bp: 6000 },
      { level: 3, cores: 5, bp: 9000 },
    ],
    effects: [
      { condition: "[LV1][LV2][LV3] (Opposing Attack Step)", text: "This Spirit can't block Spirits with BP inferior to this Spirit's." },
      { condition: "[LV1][LV2][LV3] (When Attacks)", text: "If Soul Core is on this Spirit, destroy an opposing Spirit with BP equal to or inferior to this Spirit's." },
    ],
  },
  bs01019Jurassickle: {
    id: "bs01019Jurassickle", format: "Eternal", set: "bs01",
    name: "Jurassickle", jpName: "ジュラシックル", rarity: "Common",
    type: "spirit", color: "red", cost: 5, reduction: 4, symbols: 1, exsymbols: false,
    bp: 2000, image: "./assets/cards/BS01-019.jpg", family: ["Terra Dragon"],
    levels: [
      { level: 1, cores: 1, bp: 2000 },
      { level: 2, cores: 3, bp: 4000 },
    ],
    effects: [
      { condition: "[LV1][LV2] (When Attacks)", text: "This Spirit gains +4000 BP." },
    ],
  },
  bs01019JurassickleRevival: {
    id: "bs01019JurassickleRevival", format: "Eternal", set: "bs01",
    name: "Jurassickle (Revival)", jpName: "ジュラシックル", rarity: "Common",
    type: "spirit", color: "red", cost: 5, reduction: 4, symbols: 1, exsymbols: false,
    bp: 2000, image: "./assets/cards/BSC22-019.jpg", family: ["Terra Dragon"],
    levels: [
      { level: 1, cores: 1, bp: 2000 },
      { level: 2, cores: 3, bp: 4000 },
    ],
    effects: [
      { condition: "[LV1][LV2] (When Summoned)", text: "If Soul Core was used to pay the cost, during this turn, all your \"Terra Dragon\" family Spirits gain an extra Red symbol." },
      { condition: "[LV1][LV2] (When Attacks)", text: "This Spirit gains +6000 BP." },
    ],
  },
  bs01020TheBladeDragonSteelanodon: {
    id: "bs01020TheBladeDragonSteelanodon", format: "Eternal", set: "bs01",
    name: "The BladeDragon Steelanodon", jpName: "翼刃竜スティラノドン", rarity: "Uncommon",
    type: "spirit", color: "red", cost: 6, reduction: 2, symbols: 1, exsymbols: false,
    bp: 4000, image: "./assets/cards/BS01-020.jpg", family: ["Winged Dragon"],
    levels: [
      { level: 1, cores: 1, bp: 4000 },
      { level: 2, cores: 6, bp: 10000 },
    ],
    effects: [
      { condition: "[LV1][LV2] Flash - Awaken", text: "You can send any number of cores from your Spirits to this Spirit." },
    ],
  },
  bs01020TheBladeDragonSteelanodonRevival: {
    id: "bs01020TheBladeDragonSteelanodonRevival", format: "Eternal", set: "bs01",
    name: "The BladeDragon Steelanodon (Revival)", jpName: "翼刃竜スティラノドン", rarity: "Uncommon",
    type: "spirit", color: "red", cost: 6, reduction: 2, symbols: 1, exsymbols: false,
    bp: 4000, image: "./assets/cards/BSC22-020.jpg", family: ["Winged Dragon"],
    levels: [
      { level: 1, cores: 1, bp: 4000 },
      { level: 2, cores: 6, bp: 10000 },
    ],
    effects: [
      { condition: "[LV1][LV2] Flash - Awaken", text: "You can send any number of cores from your Spirits to this Spirit." },
      { condition: "[LV2]", text: "While Soul Core is on this Spirit, this Spirit gains +10000 BP." },
    ],
  },
  bs01021TheFlameDragonMaGwo: {
    id: "bs01021TheFlameDragonMaGwo", format: "Eternal", set: "bs01",
    name: "The FlameDragon Ma-Gwo", jpName: "焔竜魔人マ・グー", rarity: "Master Rare",
    type: "spirit", color: "red", cost: 6, reduction: 2, symbols: 1, exsymbols: false,
    bp: 3000, image: "./assets/cards/BS01-021.jpg", family: ["Dragon", "Ancient Dragon"],
    levels: [
      { level: 1, cores: 1, bp: 3000 },
      { level: 2, cores: 3, bp: 5000 },
      { level: 3, cores: 7, bp: 9000 },
    ],
    effects: [
      { condition: "[LV1][LV2][LV3]", text: "For each \"Dragon\" family Spirit on your Field, this Spirit gains +1000 BP." },
    ],
  },
  bs01021TheFlameDragonMaGwoRevival: {
    id: "bs01021TheFlameDragonMaGwoRevival", format: "Eternal", set: "bs01",
    name: "The FlameDragon Ma-Gwo (Revival)", jpName: "焔竜魔人マ・グー", rarity: "Master Rare",
    type: "spirit", color: "red", cost: 6, reduction: 2, symbols: 1, exsymbols: false,
    bp: 3000, image: "./assets/cards/BSC22-021.jpg", family: ["Dragon", "Ancient Dragon"],
    levels: [
      { level: 1, cores: 1, bp: 3000 },
      { level: 2, cores: 3, bp: 5000 },
      { level: 3, cores: 7, bp: 9000 },
    ],
    effects: [
      { condition: "[LV1][LV2][LV3]", text: "For each \"Dragon\" family Spirit you control, this Spirit gains +5000 BP." },
      { condition: "[LV2][LV3] (When Attacks)", text: "Destroy an opposing 10000 BP or less Spirit. When this effect destroys any Spirit, by sending Soul Core from this Spirit to another Spirit you control, refresh this Spirit." },
    ],
  },
  bs01022TheSickleFoolJoker: {
    id: "bs01022TheSickleFoolJoker", format: "Eternal", set: "bs01",
    name: "The Sickle Fool-Joker", jpName: "大鎌フール・ジョーカー", rarity: "Rare",
    type: "spirit", color: "red", cost: 6, reduction: 3, symbols: 1, exsymbols: false,
    bp: 3000, image: "./assets/cards/BS01-022.jpg", family: ["Clown"],
    levels: [
      { level: 1, cores: 1, bp: 3000 },
      { level: 2, cores: 2, bp: 4000 },
    ],
    effects: [
      { condition: "[LV2] (When Attacks)", text: "You can destroy a 3000 BP or less Spirit." },
    ],
  },
  bs01022TheSickleFoolJokerRevival: {
    id: "bs01022TheSickleFoolJokerRevival", format: "Eternal", set: "bs01",
    name: "The Sickle Fool-Joker (Revival)", jpName: "大鎌フール・ジョーカー", rarity: "Rare",
    type: "spirit", color: "red", cost: 6, reduction: 3, symbols: 1, exsymbols: false,
    bp: 3000, image: "./assets/cards/BSC22-022.jpg", family: ["Clown"],
    levels: [
      { level: 1, cores: 1, bp: 3000 },
      { level: 2, cores: 2, bp: 4000 },
    ],
    effects: [
      { condition: "[LV2] (When Attacks)", text: "You can destroy a 3000 BP or less Spirit. By sending Soul Core from this Spirit to your Trash, instead, destroy an opposing 13000 BP or less Spirit." },
    ],
  },
  bs01023TheFireLithoGraphicaPhoenixious: {
    id: "bs01023TheFireLithoGraphicaPhoenixious", format: "Eternal", set: "bs01",
    name: "The Fire LithoGraphica Phoenixious", jpName: "原始鳥フェニキオス", rarity: "Master Rare",
    type: "spirit", color: "red", cost: 7, reduction: 3, symbols: 1, exsymbols: false,
    bp: 4000, image: "./assets/cards/BS01-023.webp", family: ["Flying Fang"],
    levels: [    
      { level: 1, cores: 1, bp: 4000 },
      { level: 2, cores: 4, bp: 7000 }
    ], effects: [
      { condition: "[LV1][LV2] (When Summoned)", text: "Destroy every 3000 BP or less Spirit." },
      { condition: "[LV2] (When Attacks)", text: "When only the opposing Spirit is destroyed by comparing BP, put a core from the Void to this Spirit." },
    ],
  },
   bs01023TheFireLithoGraphicaPhoenixiousRevival: {
    id: "bs01023TheFireLithoGraphicaPhoenixiousRevival", format: "Eternal", set: "bs01",
    name: "The Fire LithoGraphica Phoenixious (Revival)", jpName: "原始鳥フェニキオス", rarity: "Master Rare",
    type: "spirit", color: "red", cost: 7, reduction: 3, symbols: 1, exsymbols: false,
    bp: 4000, image: "./assets/cards/BSC22-023.webp", family: ["Flying Fang"],
    levels: [    
      { level: 1, cores: 1, bp: 4000 },
      { level: 2, cores: 4, bp: 7000 }
    ], effects: [
      { condition: "[LV1][LV2] (When Summoned)", text: "Destroy every opposing 6000 BP or less Spirit. When this effect destroys any Spirit, put two cores from the Void to your Reserve." },
      { condition: "[LV2] (When Battles)", text: "Put a core from the Void to any of your Spirits." },
    ],
  },
  bs01024TheCrystalDragonDiamat: {
    id: "bs01024TheCrystalDragonDiamat", format: "Eternal", set: "bs01",
    name: "The CrystalDragon Diamat", jpName: "晶輝龍ディアマット", rarity: "Rare",
    type: "spirit", color: "red", cost: 7, reduction: 3, symbols: 1, exsymbols: false,
    bp: 4000, image: "./assets/cards/BS01-024.jpg", family: ["Giant Beast"],
    levels: [
      { level: 1, cores: 1, bp: 4000 },
      { level: 2, cores: 3, bp: 6000 },
      { level: 3, cores: 5, bp: 9000 },
    ],
    effects: [
      { condition: "[LV1][LV2] (When Summoned)", text: "You can destroy a Spirit with High Speed." },
    ],
  },
  bs01024TheCrystalDragonDiamatRevival: {
    id: "bs01024TheCrystalDragonDiamatRevival", format: "Eternal", set: "bs01",
    name: "The CrystalDragon Diamat (Revival)", jpName: "晶輝龍ディアマット", rarity: "Rare",
    type: "spirit", color: "red", cost: 7, reduction: 3, symbols: 2, exsymbols: false,
    bp: 4000, image: "./assets/cards/BSC22-024.jpg", family: ["Giant Beast"],
    levels: [
      { level: 1, cores: 1, bp: 4000 },
      { level: 2, cores: 3, bp: 6000 },
      { level: 3, cores: 5, bp: 9000 },
    ],
    effects: [
      { condition: "[LV1][LV2][LV3] (When Summoned)", text: "Destroy an opposing Spirit without Soul Core on it." },
    ],
  },
  bs01025TheDragonicFortressGiga: {
    id: "bs01025TheDragonicFortressGiga", format: "Eternal", set: "bs01",
    name: "The DragonicFortress Giga", jpName: "要塞龍ギガ", rarity: "Master Rare",
    type: "spirit", color: "red", cost: 8, reduction: 4, symbols: 1, exsymbols: false,
    bp: 5000, image: "./assets/cards/BS01-025.jpg", family: ["Machine Dragon"],
    levels: [
      { level: 1, cores: 1, bp: 5000 },
      { level: 2, cores: 3, bp: 10000 },
    ],
    effects: [
      { condition: "[LV1][LV2] (When Summoned)", text: "You can destroy an opposing 6000 BP or less Spirit." },
      { condition: "[LV2] (When Battles)", text: "When only the opposing Spirit is destroyed via BP comparison, you can send any number of cores from this Spirit to other Spirits/Nexuses you control." },
    ],
  },
  bs01025TheDragonicFortressGigaRevival: {
    id: "bs01025TheDragonicFortressGigaRevival", format: "Eternal", set: "bs01",
    name: "The DragonicFortress Giga (Revival)", jpName: "要塞龍ギガ", rarity: "Master Rare",
    type: "spirit", color: "red", cost: 8, reduction: 4, symbols: 1, exsymbols: false,
    bp: 5000, image: "./assets/cards/BSC22-025.jpg", family: ["Machine Dragon"],
    levels: [
      { level: 1, cores: 1, bp: 5000 },
      { level: 2, cores: 3, bp: 10000 },
    ],
    effects: [
      { condition: "[LV1][LV2] (When Summoned)", text: "By destroying an opposing 12000 BP or less Spirit, send up to five cores from your Trash to this Spirit." },
      { condition: "[LV2] (When Battles)", text: "You can send Soul Core from your Spirits/Reserve to any Spirit/Nexus you control." },
    ],
  },
  bs01026Foger: {
    id: "bs01026Foger", format: "Eternal", set: "bs01",
    name: "Foger", jpName: "フォッガー", rarity: "Common",
    type: "spirit", color: "purple", cost: 0, reduction: 0, symbols: 1, exsymbols: false,
    bp: 1000, image: "./assets/cards/Foger1.webp", family: ["Darkling"],
    levels: [
      { level: 1, cores: 1, bp: 1000 },
      { level: 2, cores: 2, bp: 2000 },
    ],
    effects: [],
  },
  bs01026FogerRevival: {
    id: "bs01026FogerRevival", format: "Eternal", set: "bs01",
    name: "Foger (Revival)", jpName: "フォッガー", rarity: "Common",
    type: "spirit", color: "purple", cost: 0, reduction: 0, symbols: 1, exsymbols: false,
    bp: 2000, image: "./assets/cards/Foger1.webp", family: ["Darkling"],
    levels: [
      { level: 1, cores: 1, bp: 2000 },
      { level: 2, cores: 2, bp: 4000 },
    ],
    effects: [],
  },
  bs01027WillOrb: {
    id: "bs01027WillOrb", format: "Eternal", set: "bs01",
    name: "Will-Orb", jpName: "ウィル・オーブ", rarity: "Common",
    type: "spirit", color: "purple", cost: 1, reduction: 0, symbols: 1, exsymbols: false,
    bp: 3000, image: "./assets/cards/Will-orb1.webp", family: ["Darkling"],
    levels: [
      { level: 1, cores: 1, bp: 3000 },
      { level: 2, cores: 3, bp: 4000 },
      { level: 3, cores: 4, bp: 5000 },
    ],
    effects: [
      { condition: "[LV1] (During Your Battle Phase)", text: "This Spirit must attack if possible." },
    ],
  },
  bs01027WillOrbRevival: {
    id: "bs01027WillOrbRevival", format: "Eternal", set: "bs01",
    name: "Will-Orb (Revival)", jpName: "ウィル・オーブ", rarity: "Common",
    type: "spirit", color: "purple", cost: 1, reduction: 0, symbols: 1, exsymbols: false,
    bp: 5000, image: "./assets/cards/Will-orb1.webp", family: ["Darkling"],
    levels: [
      { level: 1, cores: 1, bp: 5000 },
      { level: 2, cores: 3, bp: 8000 },
      { level: 3, cores: 4, bp: 9000 },
    ],
    effects: [
      { condition: "[LV1]", text: "This Spirit must attack if possible." },
    ],
  },
  bs01028Skulldevil: {
    id: "bs01028Skulldevil", format: "Eternal", set: "bs01",
    name: "Skulldevil", jpName: "スカルデビル", rarity: "Common",
    type: "spirit", color: "purple", cost: 1, reduction: 1, symbols: 1, exsymbols: false,
    bp: 2000, image: "./assets/cards/Skulldevil1.webp", family: ["Ogre Wizard"],
    levels: [
      { level: 1, cores: 1, bp: 2000 },
      { level: 2, cores: 2, bp: 3000 },
    ],
    effects: [],
  },
  bs01028SkulldevilRevival: {
    id: "bs01028SkulldevilRevival", format: "Eternal", set: "bs01",
    name: "Skulldevil (Revival)", jpName: "スカルデビル", rarity: "Common",
    type: "spirit", color: "purple", cost: 1, reduction: 1, symbols: 1, exsymbols: false,
    bp: 4000, image: "./assets/cards/Skulldevil1.webp", family: ["Ogre Wizard"],
    levels: [
      { level: 1, cores: 1, bp: 4000 },
      { level: 2, cores: 2, bp: 5000 },
    ],
    effects: [],
  },
  bs01029RibReaper: {
    id: "bs01029RibReaper", format: "Eternal", set: "bs01",
    name: "Rib-Reaper", jpName: "リブ・リーパー", rarity: "Common",
    type: "spirit", color: "purple", cost: 2, reduction: 1, symbols: 1, exsymbols: false,
    bp: 2000, image: "./assets/cards/BS01-029.jpg", family: ["Zombie"],
    levels: [
      { level: 1, cores: 1, bp: 2000 },
      { level: 2, cores: 3, bp: 5000 },
    ],
    effects: [
      { condition: "[LV1][LV2]", text: "While there is any Red Spirit/Nexus on your Field, this Spirit gains +1000 BP." },
    ],
  },
  bs01029RibReaperRevival: {
    id: "bs01029RibReaperRevival", format: "Eternal", set: "bs01",
    name: "Rib-Reaper (Revival)", jpName: "リブ・リーパー", rarity: "Common",
    type: "spirit", color: "purple", cost: 2, reduction: 1, symbols: 1, exsymbols: false,
    bp: 2000, image: "./assets/cards/BSC22-029.jpg", family: ["Zombie"],
    levels: [
      { level: 1, cores: 1, bp: 2000 },
      { level: 2, cores: 3, bp: 5000 },
    ],
    effects: [
      { condition: "[LV1][LV2]", text: "While there is any Red symbol on your Field, this Spirit gains +8000 BP." },
    ],
  },
  bs01030GripHands: {
    id: "bs01030GripHands", format: "Eternal", set: "bs01",
    name: "Grip-Hands", jpName: "グリプ・ハンズ", rarity: "Common",
    type: "spirit", color: "purple", cost: 3, reduction: 1, symbols: 1, exsymbols: false,
    bp: 2000, image: "./assets/cards/BS01-030.jpg", family: ["Darkling"],
    levels: [
      { level: 1, cores: 1, bp: 2000 },
      { level: 2, cores: 2, bp: 3000 },
    ],
    effects: [
      { condition: "[LV1][LV2] (When Summoned)", text: "Draw a card." },
    ],
  },
  bs01030GripHandsRevival: {
    id: "bs01030GripHandsRevival", format: "Eternal", set: "bs01",
    name: "Grip-Hands (Revival)", jpName: "グリプ・ハンズ", rarity: "Common",
    type: "spirit", color: "purple", cost: 3, reduction: 1, symbols: 1, exsymbols: false,
    bp: 2000, image: "./assets/cards/BSC22-030.jpg", family: ["Darkling"],
    levels: [
      { level: 1, cores: 1, bp: 2000 },
      { level: 2, cores: 2, bp: 3000 },
    ],
    effects: [
      { condition: "[LV1][LV2] (When Summoned)", text: "Draw a card. If Soul Core is used to pay the summon cost, also, destroy an opposing Spirit with one core on it." },
    ],
  },
  bs01031DeathHaides: {
    id: "bs01031DeathHaides", format: "Eternal", set: "bs01",
    name: "Death-Haides", jpName: "デス・ハーデス", rarity: "Common",
    type: "spirit", color: "purple", cost: 3, reduction: 1, symbols: 1, exsymbols: false,
    bp: 4000, image: "./assets/cards/Death-haides1.webp", family: ["Ogre Wizard"],
    levels: [
      { level: 1, cores: 1, bp: 4000 },
      { level: 2, cores: 4, bp: 7000 },
    ],
    effects: [],
  },
  bs01031DeathHaidesRevival: {
    id: "bs01031DeathHaidesRevival", format: "Eternal", set: "bs01",
    name: "Death-Haides (Revival)", jpName: "デス・ハーデス", rarity: "Common",
    type: "spirit", color: "purple", cost: 3, reduction: 1, symbols: 1, exsymbols: false,
    bp: 8000, image: "./assets/cards/Death-haides1.webp", family: ["Ogre Wizard"],
    levels: [
      { level: 1, cores: 1, bp: 8000 },
      { level: 2, cores: 4, bp: 15000 },
    ],
    effects: [],
  },
  bs01032Gawrm: {
    id: "bs01032Gawrm", format: "Eternal", set: "bs01",
    name: "Gawrm", jpName: "ガウルム", rarity: "Common",
    type: "spirit", color: "purple", cost: 3, reduction: 2, symbols: 1, exsymbols: false,
    bp: 1000, image: "./assets/cards/Gawrm1.webp", family: ["Zombie"],
    levels: [
      { level: 1, cores: 1, bp: 1000 },
      { level: 2, cores: 3, bp: 5000 },
    ], effects: [
      { condition: "[LV2] (When Destroyed)", text: " Move this spirit to your hand instead of your trash." },
    ],
  },
    bs01032GawrmRevival: {
    id: "bs01032Gawrm", format: "Eternal", set: "bs01",
    name: "Gawrm (Revival)", jpName: "ガウルム", rarity: "Common",
    type: "spirit", color: "purple", cost: 3, reduction: 2, symbols: 1, exsymbols: false,
    bp: 1000, image: "./assets/cards/Gawrm1.webp", family: ["Zombie"],
    levels: [
      { level: 1, cores: 1, bp: 1000 },
      { level: 2, cores: 3, bp: 5000 },
    ], effects: [
      { condition: "[LV2] (When Destroyed)", text: "Send two cores from any opposing spirits to the reserve and return this spirit to your hand." },
    ],
  },
  bs01033Disaster: {
    id: "bs01033Disaster", format: "Eternal", set: "bs01",
    name: "Disaster", jpName: "ディザスター", rarity: "Common",
    type: "spirit", color: "purple", cost: 3, reduction: 2, symbols: 1, exsymbols: false,
    bp: 3000, image: "./assets/cards/Disaster1.webp", family: ["Darkling"],
    levels: [
      { level: 1, cores: 1, bp: 3000 },
      { level: 2, cores: 3, bp: 6000 }, 
      { level: 3, cores: 7, bp: 8000 },
    ], effects: [
      { condition: "[LV2][LV3] (During Your Battle Phase)", text: "This spirit must attack if possible." },
    ],
  },
   bs01033DisasterRevival: {
    id: "bs01033DisasterRevival", format: "Eternal", set: "bs01",
    name: "Disaster (Revival)", jpName: "ディザスター", rarity: "Common",
    type: "spirit", color: "purple", cost: 3, reduction: 2, symbols: 1, exsymbols: false,
    bp: 3000, image: "./assets/cards/Disaster1.webp", family: ["Darkling"],
    levels: [
      { level: 1, cores: 1, bp: 7000 },
      { level: 2, cores: 3, bp: 12000 }, 
      { level: 3, cores: 7, bp: 20000 },
    ], effects: [
      { condition: "[LV2][LV3] (During Your Battle Phase)", text: "This spirit must attack if possible." },
    ],
  },
  bs01034BiPython: {
    id: "bs01034BiPython", format: "Eternal", set: "bs01",
    name: "Bi-Python", jpName: "バイ・パイソン", rarity: "Uncommon",
    type: "spirit", color: "purple", cost: 3, reduction: 2, symbols: 1, exsymbols: false,
    bp: 2000, image: "./assets/cards/Bi-Python1.webp", family: ["Dark Snake"],
    levels: [
      { level: 1, cores: 1, bp: 2000 },
      { level: 2, cores: 2, bp: 3000 },
    ],
    effects: [
      { condition: "[LV1][LV2] (When Attacks)", text: "Draw 1 card." },
    ],
  },
  bs01034BiPythonRevival: {
    id: "bs01034BiPythonRevival", format: "Eternal", set: "bs01",
    name: "Bi-Python (Revival)", jpName: "バイ・パイソン", rarity: "Uncommon",
    type: "spirit", color: "purple", cost: 3, reduction: 2, symbols: 1, exsymbols: false,
    bp: 2000, image: "./assets/cards/Bi-Python1.webp", family: ["Dark Snake"],
    levels: [
      { level: 1, cores: 1, bp: 2000 },
      { level: 2, cores: 2, bp: 3000 },
    ],
    effects: [
      { condition: "[LV1][LV2] (When Attacks)", text: "By sending Soul Core from this Spirit to the Trash, draw two cards from your deck." },
    ],
  },
  bs01035BoneGladiator: {
    id: "bs01035BoneGladiator", format: "Eternal", set: "bs01",
    name: "Bone-Gladiator", jpName: "ボーン・グラディエイター", rarity: "Common",
    type: "spirit", color: "purple", cost: 3, reduction: 2, symbols: 1, exsymbols: false,
    bp: 2000, image: "./assets/cards/BS01-035.jpg", family: ["Ogre Wizard"],
    levels: [
      { level: 1, cores: 1, bp: 2000 },
      { level: 2, cores: 2, bp: 3000 },
      { level: 3, cores: 6, bp: 8000 },
    ],
    effects: [
      { condition: "[LV1][LV2][LV3] (When Attacks)", text: "This Spirit can't be blocked by Green Spirits." },
    ],
  },
  bs01035BoneGladiatorRevival: {
    id: "bs01035BoneGladiatorRevival", format: "Eternal", set: "bs01",
    name: "Bone-Gladiator (Revival)", jpName: "ボーン・グラディエイター", rarity: "Common",
    type: "spirit", color: "purple", cost: 3, reduction: 2, symbols: 1, exsymbols: false,
    bp: 2000, image: "./assets/cards/BSC22-035.jpg", family: ["Ogre Wizard"],
    levels: [
      { level: 1, cores: 1, bp: 2000 },
      { level: 2, cores: 2, bp: 3000 },
      { level: 3, cores: 6, bp: 8000 },
    ],
    effects: [
      { condition: "[LV1][LV2][LV3] (When Attacks)", text: "This Spirit can't be blocked by opposing Green Spirits and White Spirits." },
    ],
  },
  bs01036ShaZoo: {
    id: "bs01036ShaZoo", format: "Eternal", set: "bs01",
    name: "Sha-Zoo", jpName: "シャ・ズー", rarity: "Common",
    type: "spirit", color: "purple", cost: 3, reduction: 2, symbols: 1, exsymbols: false,
    bp: 2000, image: "./assets/cards/BSC22-036.jpg", family: ["Spiritual Beast"],
    levels: [
      { level: 1, cores: 1, bp: 2000 },
      { level: 2, cores: 3, bp: 4000 },
    ],
    effects: [
      { condition: "[LV1][LV2] (When Destroyed)", text: "Exhaust 2 target unexhausted spirits." },
    ],
  },
  bs01036ShaZooRevival: {
    id: "bs01036ShaZooRevival", format: "Eternal", set: "bs01",
    name: "Sha-Zoo (Revival)", jpName: "シャ・ズー", rarity: "Common",
    type: "spirit", color: "purple", cost: 3, reduction: 2, symbols: 1, exsymbols: false,
    bp: 2000, image: "./assets/cards/BSC22-036.jpg", family: ["Spiritual Beast"],
    levels: [
      { level: 1, cores: 1, bp: 2000 },
      { level: 2, cores: 3, bp: 4000 },
    ],
    effects: [
      { condition: "[LV1][LV2] (When Destroyed)", text: "Exhaust up to two spirits. While there is Soul Core in your trash, instead, send two cores from any opposing spirits to the reserve." },
    ],
  },
  bs01037Illusiona: {
    id: "bs01037Illusiona", format: "Eternal", set: "bs01",
    name: "Illusiona", jpName: "イリュージョナ", rarity: "Common",
    type: "spirit", color: "purple", cost: 4, reduction: 1, symbols: 1, exsymbols: false,
    bp: 4000, image: "./assets/cards/Illusiona1.webp", family: ["Spiritual Beast"],
    levels: [
      { level: 1, cores: 1, bp: 4000 },
      { level: 2, cores: 2, bp: 5000 },
      { level: 3, cores: 3, bp: 6000 },
    ],
    effects: [
      { condition: "[LV2][LV3] (When Attacks)", text: "This spirit may attack target exhausted spirit your opponent controls." },
    ],
  },
  bs01037IllusionaRevival: {
    id: "bs01037IllusionaRevival", format: "Eternal", set: "bs01",
    name: "Illusiona (Revival)", jpName: "イリュージョナ", rarity: "Common",
    type: "spirit", color: "purple", cost: 4, reduction: 1, symbols: 1, exsymbols: false,
    bp: 4000, image: "./assets/cards/Illusiona1.webp", family: ["Spiritual Beast"],
    levels: [
      { level: 1, cores: 1, bp: 4000 },
      { level: 2, cores: 2, bp: 5000 },
      { level: 3, cores: 3, bp: 6000 },
    ],
    effects: [
      { condition: "[LV1][LV2][LV3]", text: "While there is Soul Core on this spirit, all your \"Spiritual Beast\" family Spirits get +5000 BP." },
      { condition: "[LV2][LV3] (When Attacks)", text: "This Spirit can target and attack an exhausted opposing Spirit." },
    ],
  },
  bs01038SkelViper: {
    id: "bs01038SkelViper", format: "Eternal", set: "bs01",
    name: "Skel-Viper", jpName: "スケル・バイパー", rarity: "Common",
    type: "spirit", color: "purple", cost: 4, reduction: 2, symbols: 1, exsymbols: false,
    bp: 3000 , image: "./assets/cards/Skel-viper1.webp", family: ["Dark Snake"],
    levels: [
      { level: 1, cores: 1, bp: 3000 },
      { level: 2, cores: 3, bp: 6000 },
    ], effects: [
      { condition: "[LV1][LV2] (When Summoned)", text: "Draw a card." },
    ],
  },
  bs01038SkelViperRevival: {
    id: "bs01038SkelViperRevival", format: "Eternal", set: "bs01",
    name: "Skel-Viper (Revival)", jpName: "スケル・バイパー", rarity: "Common",
    type: "spirit", color: "purple", cost: 4, reduction: 2, symbols: 1, exsymbols: false,
    bp: 3000 , image: "./assets/cards/Skel-viper1.webp", family: ["Dark Snake"],
    levels: [
      { level: 1, cores: 1, bp: 3000 },
      { level: 2, cores: 3, bp: 6000 },
    ], effects: [
      { condition: "[LV1][LV2] (When Summoned)", text: "Draw a card." },
      { condition: "[LV1][LV2] ", text: "While there is Soul Core (Soul Core) on this spirit, all your \"Dark Snake\" family Spirits get +5000 BP." },
    ],
  },
  bs01039TheMysterymanDionaeman: {
    id: "bs01039TheMysterymanDionaeman", format: "Eternal", set: "bs01",
    name: "The Mysteryman Dionaeman", jpName: "怪人ディオネマン", rarity: "Common",
    type: "spirit", color: "purple", cost: 4, reduction: 2, symbols: 1, exsymbols: false,
    bp: 3000, image: "./assets/cards/BS01-039.jpg", family: ["Zombie"],
    levels: [
      { level: 1, cores: 1, bp: 3000 },
      { level: 2, cores: 2, bp: 5000 },
    ],
    effects: [],
  },
  bs01039TheMysterymanDionaemnRevival: {
    id: "bs01039TheMysterymanDionaemnRevival", format: "Eternal", set: "bs01",
    name: "The Mysteryman Dionaeman (Revival)", jpName: "怪人ディオネマン", rarity: "Common",
    type: "spirit", color: "purple", cost: 4, reduction: 2, symbols: 1, exsymbols: false,
    bp: 9000, image: "./assets/cards/BSC22-039.jpg", family: ["Zombie"],
    levels: [
      { level: 1, cores: 1, bp: 9000 },
      { level: 2, cores: 2, bp: 13000 },
    ],
    effects: [],
  },
  bs01040Darkwitch: {
    id: "bs01040Darkwitch", format: "Eternal", set: "bs01",
    name: "Darkwitch", jpName: "ダークウィッチ", rarity: "Rare",
    type: "spirit", color: "purple", cost: 4, reduction: 3, symbols: 1, exsymbols: false,
    bp: 1000, image: "./assets/cards/Darkwitch1.webp", family: ["Ogre Wizard"],
    levels: [
      { level: 1, cores: 1, bp: 1000 },
      { level: 2, cores: 3, bp: 3000 },
      { level: 3, cores: 7, bp: 5000 },
    ],
    effects: [
      { condition: "[LV2][LV3] (When Attacks)", text: "Destroy target exhausted spirit." },
    ],
  },
  bs01040DarkwitchRevival: {
    id: "bs01040DarkwitchRevival", format: "Eternal", set: "bs01",
    name: "Darkwitch (Revival)", jpName: "ダークウィッチ", rarity: "Rare",
    type: "spirit", color: "purple", cost: 4, reduction: 3, symbols: 1, exsymbols: false,
    bp: 1000, image: "./assets/cards/BSC22-040.jpg", family: ["Ogre Wizard"],
    levels: [
      { level: 1, cores: 1, bp: 1000 },
      { level: 2, cores: 3, bp: 3000 },
      { level: 3, cores: 7, bp: 5000 },
    ],
    effects: [
      { condition: "[LV1][LV2][LV3]", text: "While there is Soul Core on this spirit, all your \"Ogre Wizard\" family Spirits get +5000 BP." },
      { condition: "[LV2][LV3] (When Attacks)", text: "Destroy an exhausted spirit." },
    ],
  },
  bs01041Cobraiga: {
    id: "bs01041Cobraiga", format: "Eternal", set: "bs01",
    name: "Cobraiga", jpName: "コブライガ", rarity: "Common",
    type: "spirit", color: "purple", cost: 4, reduction: 3, symbols: 1, exsymbols: false,
    bp: 2000, image: "./assets/cards/Cobraiga1.webp", family: ["Dark Snake"],
    levels: [
      { level: 1, cores: 1, bp: 2000 },
      { level: 2, cores: 2, bp: 4000 },
    ],
    effects: [
      { condition: "[LV1][LV2] (When Summoned)", text: "Move all but one core from target spirit to its owner's reserve." },
    ],
  },
  bs01041CobraigaRevival: {
    id: "bs01041CobraigaRevival", format: "Eternal", set: "bs01",
    name: "Cobraiga (Revival)", jpName: "コブライガ", rarity: "Common",
    type: "spirit", color: "purple", cost: 4, reduction: 3, symbols: 1, exsymbols: false,
    bp: 2000, image: "./assets/cards/Cobraiga1.webp", family: ["Dark Snake"],
    levels: [
      { level: 1, cores: 1, bp: 2000 },
      { level: 2, cores: 2, bp: 4000 },
    ],
    effects: [
      { condition: "[LV1][LV2] (When Summoned)", text: "Send all but one core from an opposing Spirit/Ultimate to the Reserve." },
    ],
  },
  bs01042Mistweasel: {
    id: "bs01042Mistweasel", format: "Eternal", set: "bs01",
    name: "Mistweasel", jpName: "ミストウィゼル", rarity: "Common",
    type: "spirit", color: "purple", cost: 5, reduction: 1, symbols: 1, exsymbols: false,
    bp: 2000, image: "./assets/cards/Mistweasel1.webp", family: ["Spiritual Beast"],
    levels: [
      { level: 1, cores: 1, bp: 2000 },
      { level: 2, cores: 3, bp: 4000 },
    ],
    effects: [
      { condition: "[LV1][LV2] (When Destroyed)", text: "Draw 3 cards." },
    ],
  },
  bs01042MistweaselRevival: {
    id: "bs01042MistweaselRevival", format: "Eternal", set: "bs01",
    name: "Mistweasel (Revival)", jpName: "ミストウィゼル", rarity: "Common",
    type: "spirit", color: "purple", cost: 5, reduction: 1, symbols: 1, exsymbols: false,
    bp: 2000, image: "./assets/cards/Mistweasel1.webp", family: ["Spiritual Beast"],
    levels: [
      { level: 1, cores: 1, bp: 2000 },
      { level: 2, cores: 3, bp: 4000 },
    ],
    effects: [
      { condition: "", text: "Treat this spirit card in your trash as cost 2." },
      { condition: "[LV1][LV2] (When Destroyed)", text: "Draw 3 cards from your deck." },
    ],
  },
  bs01043Draculious: {
    id: "bs01043Draculious", format: "Eternal", set: "bs01",
    name: "Draculious", jpName: "ドラキュリウス", rarity: "Rare",
    type: "spirit", color: "purple", cost: 5, reduction: 2, symbols: 1, exsymbols: false,
    bp: 4000, image: "./assets/cards/Draculious1.webp", family: ["Ogre Wizard"],
    levels: [
      { level: 1, cores: 1, bp: 4000 },
      { level: 2, cores: 3, bp: 6000 },
      { level: 3, cores: 4, bp: 9000 },
    ],
    effects: [],
  },
  bs01043DraculiousRevival: {
    id: "bs01043DraculiousRevival", format: "Eternal", set: "bs01",
    name: "Draculious (Revival)", jpName: "ドラキュリウス", rarity: "Rare",
    type: "spirit", color: "purple", cost: 5, reduction: 2, symbols: 2, exsymbols: false,
    bp: 10000, image: "./assets/cards/BSC22-043.jpg", family: ["Ogre Wizard"],
    levels: [
      { level: 1, cores: 1, bp: 10000 },
      { level: 2, cores: 3, bp: 15000 },
      { level: 3, cores: 4, bp: 18000 },
    ],
    effects: [],
  },
  bs01044ThePhantomBullSmowg: {
    id: "bs01044ThePhantomBullSmowg", format: "Eternal", set: "bs01",
    name: "The PhantomBull Smowg", jpName: "牛霊スモゥグ", rarity: "Uncommon",
    type: "spirit", color: "purple", cost: 5, reduction: 2, symbols: 1, exsymbols: false,
    bp: 3000, image: "./assets/cards/Smowg1.webp", family: ["Spiritual Beast"],
    levels: [
      { level: 1, cores: 1, bp: 3000 },
      { level: 2, cores: 3, bp: 4000 },
      { level: 3, cores: 6, bp: 7000 },
    ],
    effects: [
      { condition: "[LV1][LV2][LV3] (When Attacks)", text: "This spirit may attack target spirit your opponent controls with only one core on it." },
    ],
  },
  bs01044ThePhantomBullSmowgRevival: {
    id: "bs01044ThePhantomBullSmowgRevival", format: "Eternal", set: "bs01",
    name: "The PhantomBull Smowg (Revival)", jpName: "牛霊スモゥグ", rarity: "Uncommon",
    type: "spirit", color: "purple", cost: 5, reduction: 2, symbols: 1, exsymbols: false,
    bp: 3000, image: "./assets/cards/Smowg1.webp", family: ["Spiritual Beast"],
    levels: [
      { level: 1, cores: 1, bp: 3000 },
      { level: 2, cores: 3, bp: 4000 },
      { level: 3, cores: 6, bp: 7000 },
    ],
    effects: [
      { condition: "[LV1][LV2][LV3] (When Attacks)", text: "This spirit may attack target spirit your opponent controls with only one core on it." },
      { condition: "[LV2][LV3] (When Attacks)", text: "If Soul Core is on this card during BP comparison, the spirit with the higher BP is destroyed instead of the one with lower BP. If BP is the same, both are destroyed." },
    ],
  },
  bs01045TheRipperHeadiless: {
    id: "bs01045TheRipperHeadiless", format: "Eternal", set: "bs01",
    name: "The Ripper Headiless", jpName: "切り裂きヘディレス", rarity: "Common",
    type: "spirit", color: "purple", cost: 5, reduction: 3, symbols: 1, exsymbols: false,
    bp: 2000, image: "./assets/cards/Headiless1.webp", family: ["Zombie"],
    levels: [
      { level: 1, cores: 1, bp: 2000 },
      { level: 2, cores: 2, bp: 3000 },
    ],
    effects: [
      { condition: "[LV1][LV2] (When Destroyed)", text: "Move this spirit to your hand instead of your trash." },
    ],
  },
  bs01045TheRipperHeadilessRevival: {
    id: "bs01045TheRipperHeadilessRevival", format: "Eternal", set: "bs01",
    name: "The Ripper Headiless (Revival)", jpName: "切り裂きヘディレス", rarity: "Common",
    type: "spirit", color: "purple", cost: 5, reduction: 3, symbols: 1, exsymbols: false,
    bp: 2000, image: "./assets/cards/Headiless1.webp", family: ["Zombie"],
    levels: [
      { level: 1, cores: 1, bp: 2000 },
      { level: 2, cores: 2, bp: 3000 },
    ],
    effects: [
      { condition: "[LV1][LV2] (When Destroyed)", text: "Send 3 cores from any opposing Spirit(s) to the Reserve, and return this spirit to your hand." },
    ],
  },
  bs01046ThePhantomDragonSheyron: {
    id: "bs01046ThePhantomDragonSheyron", format: "Eternal", set: "bs01",
    name: "The PhantomDragon Sheyron", jpName: "幻龍シェイロン", rarity: "Master Rare",
    type: "spirit", color: "purple", cost: 6, reduction: 2, symbols: 1, exsymbols: false,
    bp: 4000, image: "./assets/cards/BS01-046.jpg", family: ["Nightling", "Dark Snake"],
    levels: [
      { level: 1, cores: 1, bp: 4000 },
      { level: 2, cores: 3, bp: 8000 },
    ],
    effects: [
      { condition: "[LV1][LV2] (When Summoned)", text: "Leaving only one core each on every Spirit, send all other cores from them to their owner's Reserve." },
      { condition: "[LV2] (When Attacks)", text: "This Spirit can't be blocked by Spirits with only one core on them." },
    ],
  },
  bs01046ThePhantomDragonSheyronRevival: {
    id: "bs01046ThePhantomDragonSheyronRevival", format: "Eternal", set: "bs01",
    name: "The PhantomDragon Sheyron (Revival)", jpName: "幻龍シェイロン", rarity: "Master Rare",
    type: "spirit", color: "purple", cost: 6, reduction: 2, symbols: 1, exsymbols: false,
    bp: 4000, image: "./assets/cards/BSC22-046.jpg", family: ["Nightling", "Dark Snake"],
    levels: [
      { level: 1, cores: 1, bp: 4000 },
      { level: 2, cores: 3, bp: 8000 },
    ],
    effects: [
      { condition: "[LV1][LV2] (When Summoned)", text: "Send cores from every opposing Spirit/Ultimate to their Reserve until one core left on each of them. If Soul Core is in your Trash and it's your Turn, the cores are sent to the Trash instead." },
      { condition: "[LV2] (Your Attack Step)", text: "Your \"Dark Snake\" family Spirits can't be blocked by opposing Spirits/Ultimates with one core on them." },
    ],
  },
  bs01047TheWitchNaja: {
    id: "bs01047TheWitchNaja", format: "Eternal", set: "bs01",
    name: "The Witch Naja", jpName: "魔女ナージャ", rarity: "Rare",
    type: "spirit", color: "purple", cost: 6, reduction: 2, symbols: 1, exsymbols: false,
    bp: 3000, image: "./assets/cards/BS01-047.jpg", family: ["Evil Deity"],
    levels: [
      { level: 1, cores: 1, bp: 3000 },
      { level: 2, cores: 2, bp: 4000 },
    ],
    effects: [
      { condition: "[LV1][LV2] (When Battles)", text: "When only the opposing Spirit is destroyed by comparing BP, exhaust an opposing Spirit." },
    ],
  },
  bs01047TheWitchNajaRevival: {
    id: "bs01047TheWitchNajaRevival", format: "Eternal", set: "bs01",
    name: "The Witch Naja (Revival)", jpName: "魔女ナージャ", rarity: "Rare",
    type: "spirit", color: "purple", cost: 6, reduction: 2, symbols: 1, exsymbols: false,
    bp: 3000, image: "./assets/cards/BSC22-047.jpg", family: ["Evil Deity"],
    levels: [
      { level: 1, cores: 1, bp: 3000 },
      { level: 2, cores: 2, bp: 4000 },
    ],
    effects: [
      { condition: "[LV1][LV2] (When Battles)", text: "Send two cores from any opposing Spirits/Ultimates to their Reserve. Exhaust all Spirits/Ultimates that had core moved due to this effect." },
    ],
  },
  bs01048ThePrincessVampireVampiles: {
    id: "bs01048ThePrincessVampireVampiles", format: "Eternal", set: "bs01",
    name: "The PrincessVampire Vampiles", jpName: "吸血姫ヴァンピレス", rarity: "Uncommon",
    type: "spirit", color: "purple", cost: 6, reduction: 3, symbols: 1, exsymbols: false,
    bp: 3000, image: "./assets/cards/Vampiles1.webp", family: ["Nightling"],
    levels: [
      { level: 1, cores: 1, bp: 3000 },
      { level: 2, cores: 2, bp: 4000 },
      { level: 3, cores: 5, bp: 6000 },
    ],
    effects: [
      { condition: "[LV1][LV2][LV3] (When Summoned)", text: "Destroy target exhausted spirit." },
    ],
  },
  bs01048ThePrincessVampireVampilesRevival: {
    id: "bs01048ThePrincessVampireVampilesRevival", format: "Eternal", set: "bs01",
    name: "The PrincessVampire Vampiles (Revival)", jpName: "吸血姫ヴァンピレス", rarity: "Uncommon",
    type: "spirit", color: "purple", cost: 6, reduction: 3, symbols: 1, exsymbols: false,
    bp: 3000, image: "./assets/cards/Vampiles1.webp", family: ["Nightling"],
    levels: [
      { level: 1, cores: 1, bp: 3000 },
      { level: 2, cores: 2, bp: 4000 },
      { level: 3, cores: 5, bp: 6000 },
    ],
    effects: [
      { condition: "[LV1][LV2][LV3] (When Summoned)", text: "Destroy one opposing exhausted spirit. If Soul Core is used to pay the summon cost, also, return one Purple Spirit card from your trash to your hand." },
    ],
  },
  bs01049ThePhantomKnightNightrider: {
    id: "bs01049ThePhantomKnightNightrider", format: "Eternal", set: "bs01",
    name: "The PhantomKnight Nightrider", jpName: "幽騎士ナイトライダー", rarity: "Master Rare",
    type: "spirit", color: "purple", cost: 7, reduction: 2, symbols: 1, exsymbols: false,
    bp: 4000, image: "./assets/cards/BS01-049.jpg", family: ["Mounted Warrior"],
    levels: [
      { level: 1, cores: 1, bp: 4000 },
      { level: 2, cores: 3, bp: 6000 },
      { level: 3, cores: 4, bp: 9000 },
    ],
    effects: [
      { condition: "[LV2][LV3] (When Attacks)", text: "Destroy an exhausted Spirit you or the opponent controls." },
    ],
  },
  bs01049ThePhantomKnightNightriderRevival: {
    id: "bs01049ThePhantomKnightNightriderRevival", format: "Eternal", set: "bs01",
    name: "The PhantomKnight Nightrider (Revival)", jpName: "幽騎士ナイトライダー", rarity: "Master Rare",
    type: "spirit", color: "purple", cost: 7, reduction: 2, symbols: 1, exsymbols: false,
    bp: 4000, image: "./assets/cards/BSC22-049.jpg", family: ["Mounted Warrior"],
    levels: [
      { level: 1, cores: 1, bp: 4000 },
      { level: 2, cores: 3, bp: 6000 },
      { level: 3, cores: 4, bp: 9000 },
    ],
    effects: [
      { condition: "", text: "When your Purple Spirit is destroyed by the opponent, you can summon this Spirit card from the Hand, without paying the cost." },
      { condition: "[LV2][LV3] (When Attacks)", text: "By destroying an exhausted Spirit, this Spirit can't be blocked by opposing Spirits." },
    ],
  },
  bs01050Beatbeetle: {
    id: "bs01050Beatbeetle", format: "Eternal", set: "bs01",
    name: "Beatbeetle", jpName: "ビートビートル", rarity: "Common",
    type: "spirit", color: "green", cost: 0, reduction: 0, symbols: 1, exsymbols: false,
    bp: 1000, image: "./assets/cards/BSC22-050.jpg", family: ["Shell Insect"],
    levels: [
      { level: 1, cores: 1, bp: 1000 },
      { level: 2, cores: 2, bp: 2000 },
    ],
    effects: [],
  },
  bs01050BeatbeetleRevival: {
    id: "bs01050BeatbeetleRevival", format: "Eternal", set: "bs01",
    name: "Beatbeetle (Revival)", jpName: "ビートビートル", rarity: "Common",
    type: "spirit", color: "green", cost: 0, reduction: 0, symbols: 1, exsymbols: false,
    bp: 2000, image: "./assets/cards/BSC22-050.jpg", family: ["Shell Insect"],
    levels: [
      { level: 1, cores: 1, bp: 2000 },
      { level: 2, cores: 2, bp: 4000 },
    ],
    effects: [],
  },
  bs01051Flyingmirage: {
    id: "bs01051Flyingmirage", format: "Eternal", set: "bs01",
    name: "Flyingmirage", jpName: "フライングミラージュ", rarity: "Common",
    type: "spirit", color: "green", cost: 1, reduction: 1, symbols: 1, exsymbols: false,
    bp: 2000, image: "./assets/cards/BSC22-051.jpg", family: ["Shell Insect"],
    levels: [
      { level: 1, cores: 1, bp: 2000 },
      { level: 2, cores: 2, bp: 3000 },
    ],
    effects: [],
  },
  bs01051FlyingmirageRevival: {
    id: "bs01051FlyingmirageRevival", format: "Eternal", set: "bs01",
    name: "Flyingmirage (Revival)", jpName: "フライングミラージュ", rarity: "Common",
    type: "spirit", color: "green", cost: 1, reduction: 1, symbols: 1, exsymbols: false,
    bp: 3000, image: "./assets/cards/BSC22-051.jpg", family: ["Shell Insect"],
    levels: [
      { level: 1, cores: 1, bp: 3000 },
      { level: 2, cores: 2, bp: 6000 },
    ],
    effects: [],
  },
  bs01052Pelileaf: {
    id: "bs01052Pelileaf", format: "Eternal", set: "bs01",
    name: "Pelileaf", jpName: "ペリリィフ", rarity: "Common",
    type: "spirit", color: "green", cost: 2, reduction: 0, symbols: 1, exsymbols: false,
    bp: 3000, image: "./assets/cards/BSC22-052.jpg", family: ["Song Bird"],
    levels: [
      { level: 1, cores: 1, bp: 3000 },
      { level: 2, cores: 2, bp: 4000 },
    ],
    effects: [
      { condition: "[LV2] (Permanent)", text: "This spirit gets +2000 BP when you have a core in your reserve." },
    ],
  },
  bs01052PelileafRevival: {
    id: "bs01052PelileafRevival", format: "Eternal", set: "bs01",
    name: "Pelileaf (Revival)", jpName: "ペリリィフ", rarity: "Common",
    type: "spirit", color: "green", cost: 2, reduction: 0, symbols: 1, exsymbols: false,
    bp: 3000, image: "./assets/cards/BSC22-052.jpg", family: ["Song Bird"],
    levels: [
      { level: 1, cores: 1, bp: 3000 },
      { level: 2, cores: 2, bp: 4000 },
    ],
    effects: [
      { condition: "[LV2] (Permanent)", text: "This spirit gets +6000 BP when you have Soul Core in your reserve." },
    ],
  },
  bs01053Leavwolf: {
    id: "bs01053Leavwolf", format: "Eternal", set: "bs01",
    name: "Leavwolf", jpName: "リーヴォルフ", rarity: "Common",
    type: "spirit", color: "green", cost: 2, reduction: 1, symbols: 1, exsymbols: false,
    bp: 2000, image: "./assets/cards/BSC22-053.jpg", family: ["Blade Beast"],
    levels: [
      { level: 1, cores: 1, bp: 2000 },
      { level: 2, cores: 4, bp: 3000 },
      { level: 3, cores: 6, bp: 5000 },
    ],
    effects: [
      { condition: "[LV1][LV2] (Flash)", text: "High Speed: This spirit card may be summoned from your hand during the Flash Step. In that case, the cost of this spirit and the cores to be put on this spirit must be paid or moved from your reserve." },
    ],
  },
  bs01053LeavwolfRevival: {
    id: "bs01053LeavwolfRevival", format: "Eternal", set: "bs01",
    name: "Leavwolf (Revival)", jpName: "リーヴォルフ", rarity: "Common",
    type: "spirit", color: "green", cost: 2, reduction: 1, symbols: 1, exsymbols: false,
    bp: 2000, image: "./assets/cards/BSC22-053.jpg", family: ["Blade Beast"],
    levels: [
      { level: 1, cores: 1, bp: 2000 },
      { level: 2, cores: 4, bp: 3000 },
      { level: 3, cores: 6, bp: 5000 },
    ],
    effects: [
      { condition: "(Flash)", text: "High Speed: This spirit card may be summoned from your hand during the Flash Step. In that case, the cost of this spirit and the cores to be put on this spirit must be paid or moved from your reserve." },
      { condition: "[LV1][LV2][LV3] (Permanent)", text: "While there is Soul Core on this spirit, all your spirits with \"High Speed\" get +2000 BP." },
    ],
  },
  bs01054Shockeater: {
    id: "bs01054Shockeater", format: "Eternal", set: "bs01",
    name: "Shockeater", jpName: "ショックイーター", rarity: "Common",
    type: "spirit", color: "green", cost: 2, reduction: 1, symbols: 1, exsymbols: false,
    bp: 3000, image: "./assets/cards/BSC22-054.jpg", family: ["Plant Spirit"],
    levels: [
      { level: 1, cores: 1, bp: 3000 },
      { level: 2, cores: 2, bp: 4000 },
    ],
    effects: [],
  },
  bs01054ShockeaterRevival: {
    id: "bs01054ShockeaterRevival", format: "Eternal", set: "bs01",
    name: "Shockeater (Revival)", jpName: "ショックイーター", rarity: "Common",
    type: "spirit", color: "green", cost: 2, reduction: 1, symbols: 1, exsymbols: false,
    bp: 6000, image: "./assets/cards/BSC22-054.jpg", family: ["Plant Spirit"],
    levels: [
      { level: 1, cores: 1, bp: 6000 },
      { level: 2, cores: 2, bp: 7000 },
    ],
    effects: [],
  },
  bs01055Emeant: {
    id: "bs01055Emeant", format: "Eternal", set: "bs01",
    name: "Emeant", jpName: "エメアント", rarity: "Common",
    type: "spirit", color: "green", cost: 2, reduction: 2, symbols: 1, exsymbols: false,
    bp: 1000, image: "./assets/cards/BSC22-055.jpg", family: ["Parasite"],
    levels: [
      { level: 1, cores: 1, bp: 1000 },
      { level: 2, cores: 3, bp: 4000 },
    ],
    effects: [
      { condition: "[LV1][LV2] (When Destroyed)", text: "All spirits you control get +1000 BP until end of turn." },
    ],
  },
  bs01055EmeantRevival: {
    id: "bs01055EmeantRevival", format: "Eternal", set: "bs01",
    name: "Emeant (Revival)", jpName: "エメアント", rarity: "Common",
    type: "spirit", color: "green", cost: 2, reduction: 2, symbols: 1, exsymbols: false,
    bp: 1000, image: "./assets/cards/BSC22-055.jpg", family: ["Parasite"],
    levels: [
      { level: 1, cores: 1, bp: 1000 },
      { level: 2, cores: 3, bp: 4000 },
    ],
    effects: [
      { condition: "[LV1][LV2] (Permanent)", text: "The core on all your green spirits cannot become 0 due to your opponent." },
      { condition: "[LV1][LV2] (When Destroyed)", text: "During this turn, all Spirits you control get +3000 BP." },
    ],
  },
  bs01056Matchra: {
    id: "bs01056Matchra", format: "Eternal", set: "bs01",
    name: "Matchra", jpName: "マッチュラ", rarity: "Common",
    type: "spirit", color: "green", cost: 3, reduction: 1, symbols: 1, exsymbols: false,
    bp: 2000, image: "./assets/cards/BSC22-056.jpg", family: ["Parasite"],
    levels: [
      { level: 1, cores: 1, bp: 2000 },
      { level: 2, cores: 2, bp: 3000 },
    ],
    effects: [
      { condition: "[LV1][LV2] (When Summoned)", text: "Your opponent discards one card." },
    ],
  },
  bs01056MatchraRevival: {
    id: "bs01056MatchraRevival", format: "Eternal", set: "bs01",
    name: "Matchra (Revival)", jpName: "マッチュラ", rarity: "Common",
    type: "spirit", color: "green", cost: 3, reduction: 1, symbols: 1, exsymbols: false,
    bp: 2000, image: "./assets/cards/BSC22-056.jpg", family: ["Parasite"],
    levels: [
      { level: 1, cores: 1, bp: 2000 },
      { level: 2, cores: 2, bp: 3000 },
    ],
    effects: [
      { condition: "[LV1][LV2] (When Summoned)", text: "If Soul Core is used to pay the summon cost, discard one card from your opponent's hand without looking at the contents." },
    ],
  },
  bs01057Gularva: {
    id: "bs01057Gularva", format: "Eternal", set: "bs01",
    name: "Gularva", jpName: "グラーバ", rarity: "Common",
    type: "spirit", color: "green", cost: 3, reduction: 1, symbols: 1, exsymbols: false,
    bp: 2000, image: "./assets/cards/BSC22-057.jpg", family: ["Parasite"],
    levels: [
      { level: 1, cores: 1, bp: 2000 },
      { level: 2, cores: 3, bp: 3000 },
    ],
    effects: [
      { condition: "[LV1][LV2] (Permanent)", text: "Each time one or more cores are put on this spirit due to the effect of a spirit, nexus, or spell, increase that number by one." },
    ],
  },
  bs01057GularvaRevival: {
    id: "bs01057GularvaRevival", format: "Eternal", set: "bs01",
    name: "Gularva (Revival)", jpName: "グラーバ", rarity: "Common",
    type: "spirit", color: "green", cost: 3, reduction: 1, symbols: 1, exsymbols: false,
    bp: 2000, image: "./assets/cards/BSC22-057.jpg", family: ["Parasite"],
    levels: [
      { level: 1, cores: 1, bp: 2000 },
      { level: 2, cores: 3, bp: 3000 },
    ],
    effects: [
      { condition: "[LV1][LV2] (Permanent)", text: "While there is Soul Core on this spirit, all your \"Shell Insect\"/\"Parasite\" family Spirits get +4000 BP." },
      { condition: "[LV1][LV2] (Permanent)", text: "Each time one or more cores are put on this Spirit due to the effect of a spirit, nexus, or magic, increase that number by one." },
    ],
  },
  bs01058HerculesGeo: {
    id: "bs01058HerculesGeo", format: "Eternal", set: "bs01",
    name: "Hercules-Geo", jpName: "ヘラクレス・ジオ", rarity: "Common",
    type: "spirit", color: "green", cost: 3, reduction: 2, symbols: 1, exsymbols: false,
    bp: 4000, image: "./assets/cards/BSC22-058.jpg", family: ["Giant Beast"],
    levels: [
      { level: 1, cores: 1, bp: 4000 },
      { level: 2, cores: 3, bp: 6000 },
      { level: 3, cores: 5, bp: 8000 },
    ],
    effects: [],
  },
  bs01058HerculesGeoRevival: {
    id: "bs01058HerculesGeoRevival", format: "Eternal", set: "bs01",
    name: "Hercules-Geo (Revival)", jpName: "ヘラクレス・ジオ", rarity: "Common",
    type: "spirit", color: "green", cost: 3, reduction: 2, symbols: 1, exsymbols: false,
    bp: 8000, image: "./assets/cards/BSC22-058.jpg", family: ["Giant Beast"],
    levels: [
      { level: 1, cores: 1, bp: 8000 },
      { level: 2, cores: 3, bp: 12000 },
      { level: 3, cores: 5, bp: 16000 },
    ],
    effects: [],
  },
  bs01059Shidafukurou: {
    id: "bs01059Shidafukurou", format: "Eternal", set: "bs01",
    name: "Shidafukurou", jpName: "シダフクロウ", rarity: "Common",
    type: "spirit", color: "green", cost: 3, reduction: 2, symbols: 1, exsymbols: false,
    bp: 3000, image: "./assets/cards/BSC22-059.jpg", family: ["Winged Beast"],
    levels: [
      { level: 1, cores: 1, bp: 3000 },
      { level: 2, cores: 4, bp: 5000 },
    ],
    effects: [
      { condition: "[LV1][LV2] (Permanent)", text: "Each time your opponent draws 1 or more cards, if this spirit is exhausted, refresh this spirit." },
    ],
  },
  bs01059ShidafukurouRevival: {
    id: "bs01059ShidafukurouRevival", format: "Eternal", set: "bs01",
    name: "Shidafukurou (Revival)", jpName: "シダフクロウ", rarity: "Common",
    type: "spirit", color: "green", cost: 3, reduction: 2, symbols: 1, exsymbols: false,
    bp: 3000, image: "./assets/cards/BSC22-059.jpg", family: ["Winged Beast"],
    levels: [
      { level: 1, cores: 1, bp: 3000 },
      { level: 2, cores: 4, bp: 5000 },
    ],
    effects: [
      { condition: "[LV1][LV2] (Permanent)", text: "When your opponent draws, refresh this spirit. While there is Soul Core on this spirit, also, exhaust an opposing spirit." },
    ],
  },
  bs01060Eagrass: {
    id: "bs01060Eagrass", format: "Eternal", set: "bs01",
    name: "Eagrass", jpName: "イーグラス", rarity: "Common",
    type: "spirit", color: "green", cost: 3, reduction: 2, symbols: 1, exsymbols: false,
    bp: 2000, image: "./assets/cards/BSC22-060.jpg", family: ["Winged Beast"],
    levels: [
      { level: 1, cores: 1, bp: 2000 },
      { level: 2, cores: 2, bp: 4000 },
    ],
    effects: [
      { condition: "[LV2] (When Destroyed)", text: "All spirits you control get +2000 BP until end of turn." },
    ],
  },
  bs01060EagrassRevival: {
    id: "bs01060EagrassRevival", format: "Eternal", set: "bs01",
    name: "Eagrass (Revival)", jpName: "イーグラス", rarity: "Common",
    type: "spirit", color: "green", cost: 3, reduction: 2, symbols: 1, exsymbols: false,
    bp: 2000, image: "./assets/cards/BSC22-060.jpg", family: ["Winged Beast"],
    levels: [
      { level: 1, cores: 1, bp: 2000 },
      { level: 2, cores: 2, bp: 4000 },
    ],
    effects: [
      { condition: "[LV2] (When Destroyed)", text: "Exhaust two opposing spirits. During this turn, all your spirits get +5000 BP." },
    ],
  },
  bs01061Apewhip: {
    id: "bs01061Apewhip", format: "Eternal", set: "bs01",
    name: "Apewhip", jpName: "エイプウィップ", rarity: "Rare",
    type: "spirit", color: "green", cost: 4, reduction: 1, symbols: 1, exsymbols: false,
    bp: 1000, image: "./assets/cards/BS01-061.jpg", family: ["Imp"],
    levels: [
      { level: 1, cores: 1, bp: 1000 },
      { level: 2, cores: 4, bp: 4000 },
    ],
    effects: [
      { condition: "[LV1][LV2] (When Summoned)", text: "Put a core from the Void to your Reserve." },
    ],
  },
  bs01061ApewhipRevival: {
    id: "bs01061ApewhipRevival", format: "Eternal", set: "bs01",
    name: "Apewhip (Revival)", jpName: "エイプウィップ", rarity: "Rare",
    type: "spirit", color: "green", cost: 4, reduction: 1, symbols: 1, exsymbols: false,
    bp: 1000, image: "./assets/cards/BSC22-061.jpg", family: ["Imp"],
    levels: [
      { level: 1, cores: 1, bp: 1000 },
      { level: 2, cores: 4, bp: 4000 },
    ],
    effects: [
      { condition: "[LV1][LV2] (When Summoned)", text: "Put a core from the Void to your Reserve. Also, if Soul Core is used to pay the summon cost, put two cores from the Void to your Trash." },
    ],
  },
  bs01062Hungrytree: {
    id: "bs01062Hungrytree", format: "Eternal", set: "bs01",
    name: "Hungrytree", jpName: "ハングリートゥリー", rarity: "Rare",
    type: "spirit", color: "green", cost: 4, reduction: 2, symbols: 1, exsymbols: false,
    bp: 5000, image: "./assets/cards/BS01-062.jpg", family: ["Plant Spirit"],
    levels: [
      { level: 1, cores: 1, bp: 5000 },
      { level: 2, cores: 3, bp: 7000 },
    ],
    effects: [
      { condition: "[LV1][LV2] (When Destroyed)", text: "The opponent discards a card from their Hand." },
    ],
  },
  bs01062HungrytreeRevival: {
    id: "bs01062HungrytreeRevival", format: "Eternal", set: "bs01",
    name: "Hungrytree (Revival)", jpName: "ハングリートゥリー", rarity: "Rare",
    type: "spirit", color: "green", cost: 4, reduction: 2, symbols: 1, exsymbols: false,
    bp: 5000, image: "./assets/cards/BSC22-062.jpg", family: ["Plant Spirit"],
    levels: [
      { level: 1, cores: 1, bp: 5000 },
      { level: 2, cores: 3, bp: 7000 },
    ],
    effects: [
      { condition: "[LV1][LV2] (When Depleted/Destroyed by the Opponent)", text: "Discard a random card from the opposing Hand. After this effect resolves, if the opposing Hand is five or more, discard two random cards from their Hand." },
    ],
  },
  bs01063Emeraldscissor: {
    id: "bs01063Emeraldscissor", format: "Eternal", set: "bs01",
    name: "Emeraldscissor", jpName: "エメラルドシーザー", rarity: "Common",
    type: "spirit", color: "green", cost: 4, reduction: 2, symbols: 1, exsymbols: false,
    bp: 3000, image: "./assets/cards/BSC22-063.jpg", family: ["Parasite"],
    levels: [
      { level: 1, cores: 1, bp: 3000 },
      { level: 2, cores: 2, bp: 4000 },
    ],
    effects: [
      { condition: "[LV1][LV2] (When Summoned)", text: "Exhaust target unexhausted spirit your opponent controls." },
    ],
  },
  bs01063EmeraldscissorRevival: {
    id: "bs01063EmeraldscissorRevival", format: "Eternal", set: "bs01",
    name: "Emeraldscissor (Revival)", jpName: "エメラルドシーザー", rarity: "Common",
    type: "spirit", color: "green", cost: 4, reduction: 2, symbols: 1, exsymbols: false,
    bp: 3000, image: "./assets/cards/BSC22-063.jpg", family: ["Parasite"],
    levels: [
      { level: 1, cores: 1, bp: 3000 },
      { level: 2, cores: 2, bp: 4000 },
    ],
    effects: [
      { condition: "[LV1][LV2] (When Summoned)", text: "Exhaust an opposing Spirit/Ultimate." },
      { condition: "[LV2] (Permanent)", text: "Your opponent can't make the core on your Green spirits become less than two." },
    ],
  },
  bs01064ZigaWasp: {
    id: "bs01064ZigaWasp", format: "Eternal", set: "bs01",
    name: "Ziga-Wasp", jpName: "ジガ・ワスプ", rarity: "Common",
    type: "spirit", color: "green", cost: 4, reduction: 2, symbols: 1, exsymbols: false,
    bp: 1000, image: "./assets/cards/BSC22-064.jpg", family: ["Parasite"],
    levels: [
      { level: 1, cores: 1, bp: 1000 },
      { level: 2, cores: 2, bp: 2000 },
    ],
    effects: [
      { condition: "[LV1][LV2] (Flash)", text: "High Speed: This spirit card may be summoned from your hand during the Flash Step. In that case, the cost of this spirit and the cores to be put on this spirit must be paid or moved from your reserve." },
    ],
  },
  bs01064ZigaWaspRevival: {
    id: "bs01064ZigaWaspRevival", format: "Eternal", set: "bs01",
    name: "Ziga-Wasp (Revival)", jpName: "ジガ・ワスプ", rarity: "Common",
    type: "spirit", color: "green", cost: 4, reduction: 2, symbols: 1, exsymbols: false,
    bp: 1000, image: "./assets/cards/BSC22-064.jpg", family: ["Parasite"],
    levels: [
      { level: 1, cores: 1, bp: 1000 },
      { level: 2, cores: 2, bp: 2000 },
    ],
    effects: [
      { condition: "(Flash)", text: "High Speed: This spirit card may be summoned from your hand during the Flash Step. In that case, the cost of this spirit and the cores to be put on this spirit must be paid or moved from your reserve." },
      { condition: "[LV1][LV2] (Permanent)", text: "While there is Soul Core in your reserve, this spirit gets +8000 BP." },
    ],
  },
  bs01065Killikabut: {
    id: "bs01065Killikabut", format: "Eternal", set: "bs01",
    name: "Killikabut", jpName: "キリカブト", rarity: "Common",
    type: "spirit", color: "green", cost: 4, reduction: 2, symbols: 1, exsymbols: false,
    bp: 1000, image: "./assets/cards/BSC22-065.jpg", family: ["Parasite"],
    levels: [
      { level: 1, cores: 1, bp: 1000 },
      { level: 2, cores: 3, bp: 4000 },
      { level: 3, cores: 5, bp: 6000 },
    ],
    effects: [
      { condition: "[LV1][LV2][LV3] (When Summoned)", text: "Put a core from the Void to a Spirit you control." },
    ],
  },
  bs01065KillikabutRevival: {
    id: "bs01065KillikabutRevival", format: "Eternal", set: "bs01",
    name: "Killikabut (Revival)", jpName: "キリカブト", rarity: "Common",
    type: "spirit", color: "green", cost: 4, reduction: 2, symbols: 1, exsymbols: false,
    bp: 1000, image: "./assets/cards/BSC22-065.jpg", family: ["Parasite"],
    levels: [
      { level: 1, cores: 1, bp: 1000 },
      { level: 2, cores: 3, bp: 4000 },
      { level: 3, cores: 5, bp: 6000 },
    ],
    effects: [
      { condition: "[LV1][LV2][LV3] (When Summoned)", text: "Put a core from the Void to any Spirit you control." },
      { condition: "[LV2][LV3] (When Attacks)", text: "Exhaust an opposing spirit." },
    ],
  },
  bs01066Stagrove: {
    id: "bs01066Stagrove", format: "Eternal", set: "bs01",
    name: "Stagrove", jpName: "スタッグローブ", rarity: "Uncommon",
    type: "spirit", color: "green", cost: 4, reduction: 3, symbols: 1, exsymbols: false,
    bp: 3000, image: "./assets/cards/BSC22-066.jpg", family: ["Imp"],
    levels: [
      { level: 1, cores: 1, bp: 3000 },
      { level: 2, cores: 2, bp: 5000 },
    ],
    effects: [
      { condition: "[LV2] (When Attacks)", text: "Gain 1 core on target spirit you control except this spirit." },
    ],
  },
  bs01066StagroveRevival: {
    id: "bs01066StagroveRevival", format: "Eternal", set: "bs01",
    name: "Stagrove (Revival)", jpName: "スタッグローブ", rarity: "Uncommon",
    type: "spirit", color: "green", cost: 4, reduction: 3, symbols: 1, exsymbols: false,
    bp: 3000, image: "./assets/cards/BSC22-066.jpg", family: ["Imp"],
    levels: [
      { level: 1, cores: 1, bp: 3000 },
      { level: 2, cores: 2, bp: 5000 },
    ],
    effects: [
      { condition: "[LV2] (When Attacks)", text: "Put a core from the Void to a Spirit you control, other than this one. By sending Soul Core from this Spirit to the Reserve, refresh this Spirit." },
    ],
  },
  bs01067Swallowivy: {
    id: "bs01067Swallowivy", format: "Eternal", set: "bs01",
    name: "Swallowivy", jpName: "スワロウアイヴィー", rarity: "Uncommon",
    type: "spirit", color: "green", cost: 5, reduction: 2, symbols: 1, exsymbols: false,
    bp: 3000, image: "./assets/cards/BSC22-067.jpg", family: ["Song Bird"],
    levels: [
      { level: 1, cores: 1, bp: 3000 },
      { level: 2, cores: 3, bp: 6000 },
    ],
    effects: [
      { condition: "[LV1][LV2] (When Summoned)", text: "Reveal the top 5 cards of your Deck. If there are 1 or more nexus cards among them, move 1 of them to your hand. Return the rest to the bottom of your Deck in any order." },
    ],
  },
  bs01067SwallowivyRevival: {
    id: "bs01067SwallowivyRevival", format: "Eternal", set: "bs01",
    name: "Swallowivy (Revival)", jpName: "スワロウアイヴィー", rarity: "Uncommon",
    type: "spirit", color: "green", cost: 5, reduction: 2, symbols: 1, exsymbols: false,
    bp: 3000, image: "./assets/cards/BSC22-067.jpg", family: ["Song Bird"],
    levels: [
      { level: 1, cores: 1, bp: 3000 },
      { level: 2, cores: 3, bp: 6000 },
    ],
    effects: [
      { condition: "[LV1][LV2] (When Summoned)", text: "You can reveal 5 cards from the decktop. Add a Green Spirit/Nexus card among them to your Hand. Remaining cards are returned to the deckbottom, in any order." },
    ],
  },
  bs01068TheBlastTigerTigald: {
    id: "bs01068TheBlastTigerTigald", format: "Eternal", set: "bs01",
    name: "The BlastTiger Tigald", jpName: "風虎ティガルド", rarity: "Uncommon",
    type: "spirit", color: "green", cost: 5, reduction: 2, symbols: 1, exsymbols: false,
    bp: 3000, image: "./assets/cards/BSC22-068.jpg", family: ["Blade Beast"],
    levels: [
      { level: 1, cores: 1, bp: 3000 },
      { level: 2, cores: 4, bp: 5000 },
    ],
    effects: [
      { condition: "[LV2] (Flash)", text: "High Speed: This spirit card may be summoned from your hand during the Flash Step. In that case, the cost of this spirit and the cores to be put on this spirit must be paid or moved from your reserve." },
    ],
  },
  bs01068TheBlastTigerTigaldRevival: {
    id: "bs01068TheBlastTigerTigaldRevival", format: "Eternal", set: "bs01",
    name: "The BlastTiger Tigald (Revival)", jpName: "風虎ティガルド", rarity: "Uncommon",
    type: "spirit", color: "green", cost: 5, reduction: 2, symbols: 1, exsymbols: false,
    bp: 3000, image: "./assets/cards/BSC22-068.jpg", family: ["Blade Beast"],
    levels: [
      { level: 1, cores: 1, bp: 3000 },
      { level: 2, cores: 4, bp: 5000 },
    ],
    effects: [
      { condition: "(Flash)", text: "High Speed: This spirit card may be summoned from your hand during the Flash Step. In that case, the cost of this spirit and the cores to be put on this spirit must be paid or moved from your reserve. If Soul Core was used to pay the cost, additionally, exhaust two opposing spirits." },
    ],
  },
  bs01069TheAirMasterAquilers: {
    id: "bs01069TheAirMasterAquilers", format: "Eternal", set: "bs01",
    name: "The AirMaster Aquilers", jpName: "征空の翼アクィリーズ", rarity: "Common",
    type: "spirit", color: "green", cost: 5, reduction: 2, symbols: 1, exsymbols: false,
    bp: 4000, image: "./assets/cards/BS01-069.jpg", family: ["Winged Beast"],
    levels: [
      { level: 1, cores: 1, bp: 4000 },
      { level: 2, cores: 3, bp: 6000 },
    ],
    effects: [
      { condition: "[LV1][LV2] (When Summoned)", text: "Put a core from the Void to one of your Spirits." },
    ],
  },
  bs01069TheAirMasterAquilersRevival: {
    id: "bs01069TheAirMasterAquilersRevival", format: "Eternal", set: "bs01",
    name: "The AirMaster Aquilers (Revival)", jpName: "征空の翼アクィリーズ", rarity: "Common",
    type: "spirit", color: "green", cost: 5, reduction: 2, symbols: 1, exsymbols: false,
    bp: 4000, image: "./assets/cards/BSC22-069.jpg", family: ["Winged Beast"],
    levels: [
      { level: 1, cores: 1, bp: 4000 },
      { level: 2, cores: 3, bp: 6000 },
    ],
    effects: [
      { condition: "[LV1][LV2] (When Summoned)", text: "Put two cores from the Void to any of your Spirits." },
    ],
  },
  bs01070TheMeteoriteArmorMonoqueiroz: {
    id: "bs01070TheMeteoriteArmorMonoqueiroz", format: "Eternal", set: "bs01",
    name: "The MeteoriteArmor Monoqueiroz", jpName: "月甲モノケイロス", rarity: "Common",
    type: "spirit", color: "green", cost: 5, reduction: 3, symbols: 1, exsymbols: false,
    bp: 3000, image: "./assets/cards/BS01-070.jpg", family: ["Shellman"],
    levels: [
      { level: 1, cores: 1, bp: 3000 },
      { level: 2, cores: 4, bp: 7000 },
    ],
    effects: [
      { condition: "[LV1][LV2] (When Summoned)", text: "During this turn, all your Spirits gain +2000 BP." },
    ],
  },
  bs01070TheMeteoriteArmorMonoqueirozRevival: {
    id: "bs01070TheMeteoriteArmorMonoqueirozRevival", format: "Eternal", set: "bs01",
    name: "The MeteoriteArmor Monoqueiroz (Revival)", jpName: "月甲モノケイロス", rarity: "Common",
    type: "spirit", color: "green", cost: 5, reduction: 3, symbols: 1, exsymbols: false,
    bp: 3000, image: "./assets/cards/BSC22-070.jpg", family: ["Shellman"],
    levels: [
      { level: 1, cores: 1, bp: 3000 },
      { level: 2, cores: 4, bp: 7000 },
    ],
    effects: [
      { condition: "[LV1][LV2] (When Summoned)", text: "During this turn, all your Spirits gain +10000 BP." },
    ],
  },
  bs01071TheChargerBlanboar: {
    id: "bs01071TheChargerBlanboar", format: "Eternal", set: "bs01",
    name: "The Charger Blanboar", jpName: "爆進獣ブランボアー", rarity: "Rare",
    type: "spirit", color: "green", cost: 6, reduction: 2, symbols: 1, exsymbols: false,
    bp: 5000, image: "./assets/cards/BSC22-071.jpg", family: ["Blade Beast"],
    levels: [
      { level: 1, cores: 1, bp: 5000 },
      { level: 2, cores: 4, bp: 9000 },
    ],
    effects: [
      { condition: "[LV2] (During the Battle Phase)", text: "Each time this spirit defeats a spirit, if this spirit is exhausted, refresh this spirit." },
    ],
  },
  bs01071TheChargerBlanboarRevival: {
    id: "bs01071TheChargerBlanboarRevival", format: "Eternal", set: "bs01",
    name: "The Charger Blanboar (Revival)", jpName: "爆進獣ブランボアー", rarity: "Rare",
    type: "spirit", color: "green", cost: 6, reduction: 2, symbols: 1, exsymbols: false,
    bp: 5000, image: "./assets/cards/BSC22-071.webp", family: ["Blade Beast"],
    levels: [
      { level: 1, cores: 1, bp: 5000 },
      { level: 2, cores: 4, bp: 9000 },
    ],
    effects: [
      { condition: "[LV1][LV2] (When Battles)", text: "When the battling spirit is depleted/destroyed, refresh this spirit. When there is Soul Core on this spirit, this spirit gets +5000 BP." },
      { condition: "[LV2] (When Attacks)", text: "When the opponent's life is reduced by this spirit's attack, send one core from the opponent's life to their reserve." },
    ],
  },
  bs01072Gowsilvia: {
    id: "bs01072Gowsilvia", format: "Eternal", set: "bs01",
    name: "Gowsilvia", jpName: "ガウシルヴィア", rarity: "Master Rare",
    type: "spirit", color: "green", cost: 6, reduction: 3, symbols: 1, exsymbols: false,
    bp: 2000, image: "./assets/cards/BS01-072.jpg", family: ["Blade Beast"],
    levels: [
      { level: 1, cores: 1, bp: 2000 },
      { level: 2, cores: 3, bp: 4000 },
      { level: 3, cores: 5, bp: 7000 },
    ],
    effects: [
      { condition: "[LV2][LV3] (Permanent)", text: "This Spirit gains +1000 BP for each core in your Reserve." },
    ],
  },
  bs01072GowsilviaRevival: {
    id: "bs01072GowsilviaRevival", format: "Eternal", set: "bs01",
    name: "Gowsilvia (Revival)", jpName: "ガウシルヴィア", rarity: "Master Rare",
    type: "spirit", color: "green", cost: 6, reduction: 3, symbols: 1, exsymbols: false,
    bp: 2000, image: "./assets/cards/BSC22-072.jpg", family: ["Blade Beast"],
    levels: [
      { level: 1, cores: 1, bp: 2000 },
      { level: 2, cores: 3, bp: 4000 },
      { level: 3, cores: 5, bp: 7000 },
    ],
    effects: [
      { condition: "[LV1][LV2][LV3] (When Attacks)", text: "Send any number of cores from this Spirit to your Reserve. When you've done so, for every two cores sent to the Reserve, exhaust an opposing Spirit." },
      { condition: "[LV2][LV3] (Permanent)", text: "This Spirit gains +3000 BP for each core in your Reserve." },
    ],
  },
  bs01073TheGaudyFeatherVulpelture: {
    id: "bs01073TheGaudyFeatherVulpelture", format: "Eternal", set: "bs01",
    name: "The GaudyFeather Vulpelture", jpName: "極彩鳥ヴァルペルチャー", rarity: "Master Rare",
    type: "spirit", color: "green", cost: 8, reduction: 2, symbols: 1, exsymbols: false,
    bp: 7000, image: "./assets/cards/Vaulpelture1.webp", family: ["Winged Beast"],
    levels: [
      { level: 1, cores: 1, bp: 7000 },
      { level: 2, cores: 5, bp: 10000 },
    ],
    effects: [
      { condition: "[LV1][LV2] (Flash)", text: "High Speed: This spirit card may be summoned from your hand during the Flash Step. In that case, the cost of this spirit and the cores to be put on this spirit must be paid or moved from your reserve." },
    ],
  },
  bs01073TheGaudyFeatherVulpeltureRevival: {
    id: "bs01073TheGaudyFeatherVulpeltureRevival", format: "Eternal", set: "bs01",
    name: "The GaudyFeather Vulpelture (Revival)", jpName: "極彩鳥ヴァルペルチャー", rarity: "Master Rare",
    type: "spirit", color: "green", cost: 8, reduction: 2, symbols: 2, exsymbols: false,
    bp: 7000, image: "./assets/cards/BSC22-073.jpg", family: ["Winged Beast"],
    levels: [
      { level: 1, cores: 1, bp: 7000 },
      { level: 2, cores: 5, bp: 10000 },
    ],
    effects: [
      { condition: "(Permanent)", text: "When your life is 3 or less, this spirit card in your hand is treated as Cost 3." },
      { condition: "(Flash)", text: "High Speed: This spirit card may be summoned from your hand during the Flash Step. In that case, the cost of this spirit and the cores to be put on this spirit must be paid or moved from your reserve." },
    ],
  },
  bs01074BerserkerGun: {
    id: "bs01074BerserkerGun", format: "Eternal", set: "bs01",
    name: "Berserker-Gun", jpName: "バーサーカー・ガン", rarity: "Common",
    type: "spirit", color: "white", cost: 1, reduction: 0, symbols: 1, exsymbols: false,
    bp: 1000, image: "./assets/cards/BSC22-074.jpg", family: ["Machine"],
    levels: [
      { level: 1, cores: 1, bp: 1000 },
      { level: 2, cores: 2, bp: 3000 },
    ],
    effects: [],
  },
  bs01074BerserkerGunRevival: {
    id: "bs01074BerserkerGunRevival", format: "Eternal", set: "bs01",
    name: "Berserker-Gun (Revival)", jpName: "バーサーカー・ガン", rarity: "Common",
    type: "spirit", color: "white", cost: 1, reduction: 0, symbols: 1, exsymbols: false,
    bp: 4000, image: "./assets/cards/BSC22-074.jpg", family: ["Machine"],
    levels: [
      { level: 1, cores: 1, bp: 4000 },
      { level: 2, cores: 2, bp: 5000 },
    ],
    effects: [],
  },
  bs01075Icemaiden: {
    id: "bs01075Icemaiden", format: "Eternal", set: "bs01",
    name: "Icemaiden", jpName: "アイスメイデン", rarity: "Common",
    type: "spirit", color: "white", cost: 1, reduction: 1, symbols: 1, exsymbols: false,
    bp: 1000, image: "./assets/cards/BSC22-075.jpg", family: ["Machine"],
    levels: [
      { level: 1, cores: 1, bp: 1000 },
      { level: 2, cores: 2, bp: 2000 },
    ],
    effects: [],
  },
  bs01075IcemaidenRevival: {
    id: "bs01075IcemaidenRevival", format: "Eternal", set: "bs01",
    name: "Icemaiden (Revival)", jpName: "アイスメイデン", rarity: "Common",
    type: "spirit", color: "white", cost: 1, reduction: 1, symbols: 1, exsymbols: false,
    bp: 3000, image: "./assets/cards/BSC22-075.jpg", family: ["Machine"],
    levels: [
      { level: 1, cores: 1, bp: 3000 },
      { level: 2, cores: 2, bp: 5000 },
    ],
    effects: [],
  },
  bs01076RayBullet: {
    id: "bs01076RayBullet", format: "Eternal", set: "bs01",
    name: "Ray-Bullet", jpName: "レイ・ブレット", rarity: "Common",
    type: "spirit", color: "white", cost: 2, reduction: 0, symbols: 1, exsymbols: false,
    bp: 3000, image: "./assets/cards/BSC22-076.jpg", family: ["Flying Fish"],
    levels: [
      { level: 1, cores: 1, bp: 3000 },
      { level: 2, cores: 3, bp: 5000 },
    ],
    effects: [
      { condition: "[LV1][LV2] (Permanent)", text: "While you control an \"Armored Dragon\" spirit, this spirit gets +1000 BP." },
    ],
  },
  bs01076RayBulletRevival: {
    id: "bs01076RayBulletRevival", format: "Eternal", set: "bs01",
    name: "Ray-Bullet (Revival)", jpName: "レイ・ブレット", rarity: "Common",
    type: "spirit", color: "white", cost: 2, reduction: 0, symbols: 1, exsymbols: false,
    bp: 3000, image: "./assets/cards/BSC22-076.jpg", family: ["Flying Fish"],
    levels: [
      { level: 1, cores: 1, bp: 3000 },
      { level: 2, cores: 3, bp: 5000 },
    ],
    effects: [
      { condition: "[LV1][LV2] (Permanent)", text: "While you control an \"Armored Dragon\" family Spirit, this Spirit gets +5000 BP." },
    ],
  },
  bs01077BabyLoki: {
    id: "bs01077BabyLoki", format: "Eternal", set: "bs01",
    name: "Baby-Loki", jpName: "ベビー・ロキ", rarity: "Common",
    type: "spirit", color: "white", cost: 2, reduction: 1, symbols: 1, exsymbols: false,
    bp: 2000, image: "./assets/cards/BSC22-077.jpg", family: ["Machine"],
    levels: [
      { level: 1, cores: 1, bp: 2000 },
      { level: 2, cores: 2, bp: 3000 },
    ],
    effects: [
      { condition: "[LV2] (When Blocks)", text: "This spirit gets +1000 BP until end of turn." },
    ],
  },
  bs01077BabyLokiRevival: {
    id: "bs01077BabyLokiRevival", format: "Eternal", set: "bs01",
    name: "Baby-Loki (Revival)", jpName: "ベビー・ロキ", rarity: "Common",
    type: "spirit", color: "white", cost: 2, reduction: 1, symbols: 1, exsymbols: false,
    bp: 2000, image: "./assets/cards/BSC22-077.jpg", family: ["Machine"],
    levels: [
      { level: 1, cores: 1, bp: 2000 },
      { level: 2, cores: 2, bp: 3000 },
    ],
    effects: [
      { condition: "[LV2] (When Blocks)", text: "This Spirit gains +3000 BP and exhaust an opposing Spirit." },
    ],
  },
  bs01078TheAutoLadyMani: {
    id: "bs01078TheAutoLadyMani", format: "Eternal", set: "bs01",
    name: "The AutoLady Mani", jpName: "姫械マーニ", rarity: "Common",
    type: "spirit", color: "white", cost: 2, reduction: 1, symbols: 1, exsymbols: false,
    bp: 1000, image: "./assets/cards/BSC22-078.jpg", family: ["Ice Princess"],
    levels: [
      { level: 1, cores: 1, bp: 1000 },
      { level: 2, cores: 2, bp: 2000 },
      { level: 3, cores: 4, bp: 3000 },
    ],
    effects: [
      { condition: "[LV1][LV2][LV3] (When Attacks)", text: "Move 1 core from your trash to your reserve." },
    ],
  },
  bs01078TheAutoLadyManiRevival: {
    id: "bs01078TheAutoLadyManiRevival", format: "Eternal", set: "bs01",
    name: "The AutoLady Mani (Revival)", jpName: "姫械マーニ", rarity: "Common",
    type: "spirit", color: "white", cost: 2, reduction: 1, symbols: 1, exsymbols: false,
    bp: 1000, image: "./assets/cards/BSC22-078.jpg", family: ["Ice Princess"],
    levels: [
      { level: 1, cores: 1, bp: 1000 },
      { level: 2, cores: 2, bp: 2000 },
      { level: 3, cores: 4, bp: 3000 },
    ],
    effects: [
      { condition: "[LV1][LV2][LV3] (When Attacks)", text: "Give this spirit +3000 BP. If Soul Core is on this spirit, additionally, move 3 core from your trash to your reserve." },
    ],
  },
  bs01079Rainbowpapillon: {
    id: "bs01079Rainbowpapillon", format: "Eternal", set: "bs01",
    name: "Rainbowpapillon", jpName: "レインボウパピヨン", rarity: "Common",
    type: "spirit", color: "white", cost: 2, reduction: 1, symbols: 1, exsymbols: false,
    bp: 2000, image: "./assets/cards/BSC22-079.jpg", family: ["Glow Insect"],
    levels: [
      { level: 1, cores: 1, bp: 2000 },
      { level: 2, cores: 3, bp: 3000 },
    ],
    effects: [
      { condition: "[LV1][LV2] (Permanent)", text: "While you control a green spirit, this spirit gets +1000 BP." },
    ],
  },
  bs01079RainbowpapillonRevival: {
    id: "bs01079RainbowpapillonRevival", format: "Eternal", set: "bs01",
    name: "Rainbowpapillon (Revival)", jpName: "レインボウパピヨン", rarity: "Common",
    type: "spirit", color: "white", cost: 2, reduction: 1, symbols: 1, exsymbols: false,
    bp: 2000, image: "./assets/cards/BSC22-079.jpg", family: ["Glow Insect"],
    levels: [
      { level: 1, cores: 1, bp: 2000 },
      { level: 2, cores: 3, bp: 3000 },
    ],
    effects: [
      { condition: "[LV1][LV2] (Permanent)", text: "While you control a green spirit, this spirit gets +8000 BP." },
    ],
  },
  bs01080Fenrircannon: {
    id: "bs01080Fenrircannon", format: "Eternal", set: "bs01",
    name: "Fenrircannon", jpName: "フェンリルキャノン", rarity: "Common",
    type: "spirit", color: "white", cost: 3, reduction: 1, symbols: 1, exsymbols: false,
    bp: 3000, image: "./assets/cards/BSC22-080.jpg", family: ["Machine Beast"],
    levels: [
      { level: 1, cores: 1, bp: 3000 },
      { level: 2, cores: 3, bp: 5000 },
    ],
    effects: [
      { condition: "[LV1][LV2] (When Blocks)", text: "This spirit gets +1000 BP until the end of the turn." },
    ],
  },
  bs01080FenrircannonRevival: {
    id: "bs01080FenrircannonRevival", format: "Eternal", set: "bs01",
    name: "Fenrircannon (Revival)", jpName: "フェンリルキャノン", rarity: "Common",
    type: "spirit", color: "white", cost: 3, reduction: 1, symbols: 1, exsymbols: false,
    bp: 3000, image: "./assets/cards/BSC22-080.jpg", family: ["Machine Beast"],
    levels: [
      { level: 1, cores: 1, bp: 3000 },
      { level: 2, cores: 3, bp: 5000 },
    ],
    effects: [
      { condition: "[LV1][LV2] (When Blocks)", text: "This spirit gets +5000 BP, and refresh a White Spirit you control other than this one." },
    ],
  },
  bs01081TheSilverScaleNithhoggr: {
    id: "bs01081TheSilverScaleNithhoggr", format: "Eternal", set: "bs01",
    name: "The SilverScale Nithhoggr", jpName: "銀燐竜ニーズホッグ", rarity: "Common",
    type: "spirit", color: "white", cost: 3, reduction: 1, symbols: 1, exsymbols: false,
    bp: 1000, image: "./assets/cards/BSC22-081.jpg", family: ["Armored Dragon", "Armored Beast"],
    levels: [
      { level: 1, cores: 1, bp: 1000 },
      { level: 2, cores: 2, bp: 3000 },
    ],
    effects: [
      { condition: "[LV1][LV2] When Blocks", text: "This spirit gets +4000 BP until end of turn." },
    ],
  },
  bs01081TheSilverScaleNithhoggrRevival: {
    id: "bs01081TheSilverScaleNithhoggrRevival", format: "Eternal", set: "bs01",
    name: "The SilverScale Nithhoggr (Revival)", jpName: "銀燐竜ニーズホッグ", rarity: "Common",
    type: "spirit", color: "white", cost: 3, reduction: 1, symbols: 1, exsymbols: false,
    bp: 1000, image: "./assets/cards/BSC22-081.jpg", family: ["Armored Dragon", "Armored Beast"],
    levels: [
      { level: 1, cores: 1, bp: 1000 },
      { level: 2, cores: 2, bp: 3000 },
    ],
    effects: [
      { condition: "[LV1][LV2] When Blocks", text: "This spirit gets +5000 BP." },
      { condition: "[LV2]", text: "This Spirit can block while exhausted." },
    ],
  },
  bs01082UrDine: {
    id: "bs01082UrDine", format: "Eternal", set: "bs01",
    name: "Ur-Dine", jpName: "ウル・ディーネ", rarity: "Common",
    type: "spirit", color: "white", cost: 3, reduction: 2, symbols: 1, exsymbols: false,
    bp: 1000, image: "./assets/cards/BSC22-082.jpg", family: ["Evil Deity"],
    levels: [
      { level: 1, cores: 1, bp: 1000 },
      { level: 2, cores: 2, bp: 2000 },
    ],
    effects: [
      { condition: "[LV1][LV2] (When Attacks)", text: "Gain 1 core in your reserve." },
    ],
  },
  bs01082UrDineRevival: {
    id: "bs01082UrDineRevival", format: "Eternal", set: "bs01",
    name: "Ur-Dine (Revival)", jpName: "ウル・ディーネ", rarity: "Common",
    type: "spirit", color: "white", cost: 3, reduction: 2, symbols: 1, exsymbols: false,
    bp: 1000, image: "./assets/cards/BSC22-082.jpg", family: ["Evil Deity"],
    levels: [
      { level: 1, cores: 1, bp: 1000 },
      { level: 2, cores: 2, bp: 2000 },
    ],
    effects: [
      { condition: "[LV1][LV2] (When Attacks)", text: "Put a core from the Void to your Reserve." },
      { condition: "[LV2] (When Destroyed)", text: "If Soul Core is on this spirit, it remains on the field, exhausted." },
    ],
  },
  bs01083Rabicrysta: {
    id: "bs01083Rabicrysta", format: "Eternal", set: "bs01",
    name: "Rabicrysta", jpName: "ラビクリスタ", rarity: "Common",
    type: "spirit", color: "white", cost: 3, reduction: 2, symbols: 1, exsymbols: false,
    bp: 2000, image: "./assets/cards/BSC22-083.jpg", family: ["Drifting Spirit"],
    levels: [
      { level: 1, cores: 1, bp: 2000 },
      { level: 2, cores: 5, bp: 6000 },
    ],
    effects: [
      { condition: "[LV1][LV2] (When Attacks)", text: "This spirit cannot be blocked by red spirits this turn." },
    ],
  },
  bs01083RabicrystaRevival: {
    id: "bs01083RabicrystaRevival", format: "Eternal", set: "bs01",
    name: "Rabicrysta (Revival)", jpName: "ラビクリスタ", rarity: "Common",
    type: "spirit", color: "white", cost: 3, reduction: 2, symbols: 1, exsymbols: false,
    bp: 2000, image: "./assets/cards/BSC22-083.jpg", family: ["Drifting Spirit"],
    levels: [
      { level: 1, cores: 1, bp: 2000 },
      { level: 2, cores: 5, bp: 6000 },
    ],
    effects: [
      { condition: "[LV1][LV2] (When Attacks)", text: "This Spirit cannot be blocked by opposing Red/Purple Spirits." },
    ],
  },
  bs01084Gatlingstand: {
    id: "bs01084Gatlingstand", format: "Eternal", set: "bs01",
    name: "Gatlingstand", jpName: "ガトリングスタンド", rarity: "Common",
    type: "spirit", color: "white", cost: 3, reduction: 2, symbols: 1, exsymbols: false,
    bp: 3000, image: "./assets/cards/BSC22-084.jpg", family: ["Armed Machine"],
    levels: [
      { level: 1, cores: 1, bp: 3000 },
      { level: 2, cores: 2, bp: 5000 },
    ],
    effects: [],
  },
  bs01084GatlingstandRevival: {
    id: "bs01084GatlingstandRevival", format: "Eternal", set: "bs01",
    name: "Gatlingstand (Revival)", jpName: "ガトリングスタンド", rarity: "Common",
    type: "spirit", color: "white", cost: 3, reduction: 2, symbols: 1, exsymbols: false,
    bp: 7000, image: "./assets/cards/BSC22-084.jpg", family: ["Armed Machine"],
    levels: [
      { level: 1, cores: 1, bp: 7000 },
      { level: 2, cores: 2, bp: 11000 },
    ],
    effects: [],
  },
  bs01085Elephantite: {
    id: "bs01085Elephantite", format: "Eternal", set: "bs01",
    name: "Elephantite", jpName: "エレファンタイト", rarity: "Uncommon",
    type: "spirit", color: "white", cost: 4, reduction: 1, symbols: 1, exsymbols: false,
    bp: 4000, image: "./assets/cards/BSC22-085.jpg", family: ["Armored Beast"],
    levels: [
      { level: 1, cores: 1, bp: 4000 },
      { level: 2, cores: 4, bp: 7000 },
    ],
    effects: [
      { condition: "[LV1][LV2] (When Blocks)", text: "This spirit gets +2000 BP until end of turn." },
    ],
  },
  bs01085ElephantiteRevival: {
    id: "bs01085ElephantiteRevival", format: "Eternal", set: "bs01",
    name: "Elephantite (Revival)", jpName: "エレファンタイト", rarity: "Uncommon",
    type: "spirit", color: "white", cost: 4, reduction: 1, symbols: 1, exsymbols: false,
    bp: 4000, image: "./assets/cards/BSC22-085.jpg", family: ["Armored Beast"],
    levels: [
      { level: 1, cores: 1, bp: 4000 },
      { level: 2, cores: 4, bp: 7000 },
    ],
    effects: [
      { condition: "[LV1][LV2] (When Blocks)", text: "This Spirit gets +5000 BP, and return an opposing Spirit to the hand." },
    ],
  },
  bs01086QueenValkyrie: {
    id: "bs01086QueenValkyrie", format: "Eternal", set: "bs01",
    name: "Queen-Valkyrie", jpName: "クイーン・ワルキューレ", rarity: "Common",
    type: "spirit", color: "white", cost: 4, reduction: 2, symbols: 1, exsymbols: false,
    bp: 2000, image: "./assets/cards/BSC22-086.jpg", family: ["Android"],
    levels: [
      { level: 1, cores: 1, bp: 2000 },
      { level: 2, cores: 4, bp: 4000 },
    ],
    effects: [
      { condition: "[LV1][LV2] (Permanent)", text: "This spirit is unaffected by the effects of the opponent's spirits and magic." },
    ],
  },
  bs01086QueenValkyrieRevival: {
    id: "bs01086QueenValkyrieRevival", format: "Eternal", set: "bs01",
    name: "Queen-Valkyrie (Revival)", jpName: "クイーン・ワルキューレ", rarity: "Common",
    type: "spirit", color: "white", cost: 4, reduction: 2, symbols: 1, exsymbols: false,
    bp: 2000, image: "./assets/cards/BSC22-086.jpg", family: ["Android"],
    levels: [
      { level: 1, cores: 1, bp: 2000 },
      { level: 2, cores: 4, bp: 4000 },
    ],
    effects: [
      { condition: "[LV1][LV2] (Permanent)", text: "This Spirit is unaffected by opposing Spirit/Magic effects." },
      { condition: "[LV2] (When Battles)", text: "By sending Soul Core from this Spirit to your trash, refresh this Spirit." },
    ],
  },
  bs01087MetaldyBug: {
    id: "bs01087MetaldyBug", format: "Eternal", set: "bs01",
    name: "Metaldy-Bug", jpName: "メタルディー・バグ", rarity: "Uncommon",
    type: "spirit", color: "white", cost: 4, reduction: 2, symbols: 1, exsymbols: false,
    bp: 3000, image: "./assets/cards/BSC22-087.jpg", family: ["Glow Insect"],
    levels: [
      { level: 1, cores: 1, bp: 3000 },
      { level: 2, cores: 2, bp: 4000 },
    ],
    effects: [
      { condition: "[LV1][LV2] (When Summoned)", text: "Each player moves 1 core from a spirit they control to the trash." },
    ],
  },
  bs01087MetaldyBugRevival: {
    id: "bs01087MetaldyBugRevival", format: "Eternal", set: "bs01",
    name: "Metaldy-Bug (Revival)", jpName: "メタルディー・バグ", rarity: "Uncommon",
    type: "spirit", color: "white", cost: 4, reduction: 2, symbols: 1, exsymbols: false,
    bp: 3000, image: "./assets/cards/BSC22-087.jpg", family: ["Glow Insect"],
    levels: [
      { level: 1, cores: 1, bp: 3000 },
      { level: 2, cores: 2, bp: 4000 },
    ],
    effects: [
      { condition: "[LV1][LV2] (When Summoned)", text: "Each player moves 1 core from a spirit they control to the trash." },
      { condition: "[LV2] (When Destroyed)", text: "This spirit returns to your hand." },
    ],
  },
  bs01088Towermittcrab: {
    id: "bs01088Towermittcrab", format: "Eternal", set: "bs01",
    name: "Towermittcrab", jpName: "タワーミットクラブ", rarity: "Common",
    type: "spirit", color: "white", cost: 4, reduction: 2, symbols: 1, exsymbols: false,
    bp: 2000, image: "./assets/cards/BSC22-088.jpg", family: ["Giant Beast"],
    levels: [
      { level: 1, cores: 1, bp: 2000 },
      { level: 2, cores: 2, bp: 3000 },
    ],
    effects: [
      { condition: "[LV1][LV2] (Permanent)", text: "This spirit gets +1000 BP for each nexus you control." },
    ],
  },
  bs01088TowermittcrabRevival: {
    id: "bs01088TowermittcrabRevival", format: "Eternal", set: "bs01",
    name: "Towermittcrab (Revival)", jpName: "タワーミットクラブ", rarity: "Common",
    type: "spirit", color: "white", cost: 4, reduction: 2, symbols: 1, exsymbols: false,
    bp: 2000, image: "./assets/cards/BSC22-088.jpg", family: ["Giant Beast"],
    levels: [
      { level: 1, cores: 1, bp: 2000 },
      { level: 2, cores: 2, bp: 3000 },
    ],
    effects: [
      { condition: "[LV1][LV2] (Permanent)", text: "This spirit gets +5000 BP for each nexus you control." },
    ],
  },
  bs01089DualcannonBell: {
    id: "bs01089DualcannonBell", format: "Eternal", set: "bs01",
    name: "Dualcannon-Bell", jpName: "デュアルキャノン・ベル", rarity: "Common",
    type: "spirit", color: "white", cost: 4, reduction: 3, symbols: 1, exsymbols: false,
    bp: 3000, image: "./assets/cards/BSC22-089.jpg", family: ["Android", "Armed Machine"],
    levels: [
      { level: 1, cores: 1, bp: 3000 },
      { level: 2, cores: 3, bp: 5000 },
    ],
    effects: [],
  },
  bs01089DualcannonBellRevival: {
    id: "bs01089DualcannonBellRevival", format: "Eternal", set: "bs01",
    name: "Dualcannon-Bell (Revival)", jpName: "デュアルキャノン・ベル", rarity: "Common",
    type: "spirit", color: "white", cost: 4, reduction: 3, symbols: 1, exsymbols: false,
    bp: 6000, image: "./assets/cards/BSC22-089.jpg", family: ["Android", "Armed Machine"],
    levels: [
      { level: 1, cores: 1, bp: 6000 },
      { level: 2, cores: 3, bp: 10000 },
    ],
    effects: [],
  },
  bs01090HellBlindi: {
    id: "bs01090HellBlindi", format: "Eternal", set: "bs01",
    name: "Hell-Blindi", jpName: "ヘル・ブリンディ", rarity: "Uncommon",
    type: "spirit", color: "white", cost: 4, reduction: 3, symbols: 1, exsymbols: false,
    bp: 1000, image: "./assets/cards/BSC22-090.jpg", family: ["Android"],
    levels: [
      { level: 1, cores: 1, bp: 1000 },
      { level: 2, cores: 3, bp: 3000 },
    ],
    effects: [
      { condition: "[LV1][LV2] (When Summoned)", text: "Return a Spirit to its owner's Hand." },
    ],
  },
  bs01090HellBlindiRevival: {
    id: "bs01090HellBlindiRevival", format: "Eternal", set: "bs01",
    name: "Hell-Blindi (Revival)", jpName: "ヘル・ブリンディ", rarity: "Uncommon",
    type: "spirit", color: "white", cost: 4, reduction: 3, symbols: 1, exsymbols: false,
    bp: 1000, image: "./assets/cards/BSC22-090.jpg", family: ["Android"],
    levels: [
      { level: 1, cores: 1, bp: 1000 },
      { level: 2, cores: 3, bp: 3000 },
    ],
    effects: [
      { condition: "[LV1][LV2] (When Summoned)", text: "Return an opposing Spirit to the hand. When Soul Core was used to pay the summon cost, also, return a Spirit you control to the hand." },
    ],
  },
  bs01091TheArtifactLaguna: {
    id: "bs01091TheArtifactLaguna", format: "Eternal", set: "bs01",
    name: "The Artifact Laguna", jpName: "機人ラグーナ", rarity: "Uncommon",
    type: "spirit", color: "white", cost: 5, reduction: 1, symbols: 1, exsymbols: false,
    bp: 6000, image: "./assets/cards/BS01-091.jpg", family: ["Android"],
    levels: [
      { level: 1, cores: 1, bp: 6000 },
      { level: 2, cores: 2, bp: 7000 },
    ],
    effects: [
      { condition: "[LV2] (Permanent)", text: "All your White Spirits gain +1000 BP." },
    ],
  },
  bs01091TheArtifactLagunaRevival: {
    id: "bs01091TheArtifactLagunaRevival", format: "Eternal", set: "bs01",
    name: "The Artifact Laguna (Revival)", jpName: "機人ラグーナ", rarity: "Uncommon",
    type: "spirit", color: "white", cost: 5, reduction: 1, symbols: 1, exsymbols: false,
    bp: 6000, image: "./assets/cards/BSC22-091.jpg", family: ["Android"],
    levels: [
      { level: 1, cores: 1, bp: 6000 },
      { level: 2, cores: 2, bp: 7000 },
    ],
    effects: [
      { condition: "[LV2] (Permanent)", text: "All your White Spirits gain +5000 BP." },
    ],
  },
  bs01092TheCarrierWhaleMobileflow: {
    id: "bs01092TheCarrierWhaleMobileflow", format: "Eternal", set: "bs01",
    name: "The CarrierWhale Mobileflow", jpName: "空母鯨モビルフロウ", rarity: "Common",
    type: "spirit", color: "white", cost: 5, reduction: 2, symbols: 1, exsymbols: false,
    bp: 5000, image: "./assets/cards/BSC22-092.jpg", family: ["Flying Fish"],
    levels: [
      { level: 1, cores: 1, bp: 5000 },
      { level: 2, cores: 2, bp: 6000 },
    ],
    effects: [],
  },
  bs01092TheCarrierWhaleMobileflowRevival: {
    id: "bs01092TheCarrierWhaleMobileflowRevival", format: "Eternal", set: "bs01",
    name: "The CarrierWhale Mobileflow (Revival)", jpName: "空母鯨モビルフロウ", rarity: "Common",
    type: "spirit", color: "white", cost: 5, reduction: 2, symbols: 1, exsymbols: false,
    bp: 12000, image: "./assets/cards/BSC22-092.jpg", family: ["Flying Fish"],
    levels: [
      { level: 1, cores: 1, bp: 12000 },
      { level: 2, cores: 2, bp: 15000 },
    ],
    effects: [],
  },
  bs01093TheShieldSpiritDis: {
    id: "bs01093TheShieldSpiritDis", format: "Eternal", set: "bs01",
    name: "The ShieldSpirit Dis", jpName: "甲精ディース", rarity: "Master Rare",
    type: "spirit", color: "white", cost: 5, reduction: 3, symbols: 1, exsymbols: false,
    bp: 3000, image: "./assets/cards/BS01-093.jpg", family: ["Clown"],
    levels: [
      { level: 1, cores: 1, bp: 3000 },
      { level: 2, cores: 4, bp: 6000 },
    ],
    effects: [
      { condition: "[LV1][LV2] (When Attacks)", text: "When the opponent declares block, exhaust a Spirit except the one blocking this Spirit." },
      { condition: "[LV2] (When Destroyed)", text: "Refresh a Spirit you control." },
    ],
  },
  bs01093TheShieldSpiritDisRevival: {
    id: "bs01093TheShieldSpiritDisRevival", format: "Eternal", set: "bs01",
    name: "The ShieldSpirit Dis (Revival)", jpName: "甲精ディース", rarity: "Master Rare",
    type: "spirit", color: "white", cost: 5, reduction: 3, symbols: 1, exsymbols: false,
    bp: 3000, image: "./assets/cards/BSC22-093.jpg", family: ["Clown"],
    levels: [
      { level: 1, cores: 1, bp: 3000 },
      { level: 2, cores: 4, bp: 6000 },
    ],
    effects: [
      { condition: "[LV1][LV2] (When Attacks)", text: "When the opponent declares block, return an opposing Spirit, except the one blocking this Spirit, to the Hand. When you've done so, put two cores from the Void to this Spirit." },
      { condition: "[LV2] (When Destroyed)", text: "This Spirit remains on Field in the same condition, and refresh another Spirit you control." },
    ],
  },
  bs01094GranDolbalkan: {
    id: "bs01094GranDolbalkan", format: "Eternal", set: "bs01",
    name: "Gran-Dolbalkan", jpName: "グラン・ドルバルカン", rarity: "Rare",
    type: "spirit", color: "white", cost: 5, reduction: 4, symbols: 1, exsymbols: false,
    bp: 1000, image: "./assets/cards/BS01-094.jpg", family: ["Machine Beast"],
    levels: [
      { level: 1, cores: 1, bp: 1000 },
      { level: 2, cores: 2, bp: 2000 },
      { level: 3, cores: 4, bp: 4000 },
    ],
    effects: [
      { condition: "[LV1][LV2][LV3] Flash (When Battles)", text: "By sending one core from your Reserve to your Trash, immediately end the battle." },
    ],
  },
  bs01094GranDolbalkanRevival: {
    id: "bs01094GranDolbalkanRevival", format: "Eternal", set: "bs01",
    name: "Gran-Dolbalkan (Revival)", jpName: "グラン・ドルバルカン", rarity: "Rare",
    type: "spirit", color: "white", cost: 5, reduction: 4, symbols: 1, exsymbols: false,
    bp: 4000, image: "./assets/cards/BSC22-094.jpg", family: ["Machine Beast"],
    levels: [
      { level: 1, cores: 1, bp: 4000 },
      { level: 2, cores: 2, bp: 6000 },
      { level: 3, cores: 4, bp: 8000 },
    ],
    effects: [
      { condition: "[LV1][LV2][LV3] Flash (When Battles)", text: "By sending one core from your Reserve to your Trash, immediately end the battle. When Soul Core is sent to your Trash via this effect, refresh this Spirit." },
    ],
  },
  bs01095TheArmoredBeastBearGelmir: {
    id: "bs01095TheArmoredBeastBearGelmir", format: "Eternal", set: "bs01",
    name: "The ArmoredBeast Bear-Gelmir", jpName: "鎧装獣ベア・ゲルミル", rarity: "Master Rare",
    type: "spirit", color: "white", cost: 8, reduction: 3, symbols: 1, exsymbols: false,
    bp: 7000, image: "./assets/cards/BS01-095.webp", family: ["Armored Beast"],
    levels: [
      { level: 1, cores: 1, bp: 7000 },
      { level: 2, cores: 2, bp: 9000 },
    ],
    effects: [
      { condition: "[LV1][LV2] (During Your Battle Phase)", text: "While your opponent controls no red spirits, this spirit cannot attack." },
      { condition: "[LV2] (Permanent)", text: "All green spirits you control get +1000 BP." },
    ],
  },
  bs01095TheArmoredBeastBearGelmirRevival: {
    id: "bs01095TheArmoredBeastBearGelmirRevival", format: "Eternal", set: "bs01",
    name: "The ArmoredBeast Bear-Gelmir (Revival)", jpName: "鎧装獣ベア・ゲルミル", rarity: "Master Rare",
    type: "spirit", color: "white", cost: 8, reduction: 3, symbols: 2, exsymbols: false,
    bp: 7000, image: "./assets/cards/BSC22-095.jpg", family: ["Armored Beast"],
    levels: [
      { level: 1, cores: 1, bp: 7000 },
      { level: 2, cores: 2, bp: 9000 },
    ],
    effects: [
      { condition: "[LV1][LV2] (When Summoned)", text: "Return all opposing non-Red Spirits/Ultimates to the hand." },
      { condition: "[LV1][LV2] (Permanent)", text: "While your opponent does not control any Red Spirits/Ultimates, this Spirit cannot attack." },
      { condition: "[LV2] (Permanent)", text: "All Green Spirits you control get +5000 BP." },
    ],
  },
  bs01096TheAutoEmpressSol: {
    id: "bs01096TheAutoEmpressSol", format: "Eternal", set: "bs01",
    name: "The AutoEmpress Sol", jpName: "妖機妃ソール", rarity: "Rare",
    type: "spirit", color: "white", cost: 8, reduction: 3, symbols: 1, exsymbols: false,
    bp: 2000, image: "./assets/cards/BS01-096.jpg", family: ["Ice Princess"],
    levels: [
      { level: 1, cores: 1, bp: 2000 },
      { level: 2, cores: 4, bp: 6000 },
    ],
    effects: [
      { condition: "[LV1] (When Destroyed)", text: "If it is the opposing turn, skip the Attack Step. Or end it." },
    ],
  },
  bs01096TheAutoEmpressSolRevival: {
    id: "bs01096TheAutoEmpressSolRevival", format: "Eternal", set: "bs01",
    name: "The AutoEmpress Sol (Revival)", jpName: "妖機妃ソール", rarity: "Rare",
    type: "spirit", color: "white", cost: 8, reduction: 3, symbols: 1, exsymbols: false,
    bp: 2000, image: "./assets/cards/BSC22-096.jpg", family: ["Ice Princess"],
    levels: [
      { level: 1, cores: 1, bp: 2000 },
      { level: 2, cores: 4, bp: 6000 },
    ],
    effects: [
      { condition: "(Hand)", text: "When your White Spirits are destroyed by the opponent, you can summon this card from the Hand, without paying the cost." },
      { condition: "[LV1][LV2] (Opposing Attack Step)", text: "The Spirit can block while exhausted." },
      { condition: "[LV1][LV2] (When Depleted/Destroyed by the Opponent)", text: "If this Spirit is depleted/destroyed in the opposing turn, when this battle ends, end the Attack Step." },
    ],
  },
  bs01097TheSteelWyvernValkyrious: {
    id: "bs01097TheSteelWyvernValkyrious", format: "Eternal", set: "bs01",
    name: "The SteelWyvern Valkyrious", jpName: "飛龍ヴァルキュリウス", rarity: "Rare",
    type: "spirit", color: "white", cost: 8, reduction: 5, symbols: 1, exsymbols: false,
    bp: 4000, image: "./assets/cards/Valkyrious1.webp", family: ["Machine Dragon"],
    levels: [
      { level: 1, cores: 1, bp: 4000 },
      { level: 2, cores: 4, bp: 6000 },
      { level: 3, cores: 8, bp: 9000 },
    ],
    effects: [
      { condition: "[LV1][LV2][LV3] (When Blocks)", text: "This spirit gets +6000 BP until end of turn." },
    ],
  },
  bs01097TheSteelWyvernValkyriousRevival: {
    id: "bs01097TheSteelWyvernValkyriousRevival", format: "Eternal", set: "bs01",
    name: "The SteelWyvern Valkyrious (Revival)", jpName: "飛龍ヴァルキュリウス", rarity: "Rare",
    type: "spirit", color: "white", cost: 8, reduction: 5, symbols: 2, exsymbols: false,
    bp: 4000, image: "./assets/cards/BSC22-097.jpg", family: ["Machine Dragon"],
    levels: [
      { level: 1, cores: 1, bp: 4000 },
      { level: 2, cores: 4, bp: 6000 },
      { level: 3, cores: 8, bp: 9000 },
    ],
    effects: [
      { condition: "[LV1][LV2][LV3] (When Battles)", text: "This Spirit gets +10000 BP. By sending Soul Core from this Spirit to the trash, also, return two opposing Spirits/Ultimates with 15000 BP or less to the hand." },
    ],
  },
  bs01098TheBurningBattlefield: {
    id: "bs01098TheBurningBattlefield", format: "Eternal", set: "bs01",
    name: "The Burning Battlefield", jpName: "燃えさかる戦場", rarity: "Uncommon",
    type: "nexus", color: "red", cost: 3, reduction: 2, symbols: 1, exsymbols: false,
    bp: 0, image: "./assets/cards/BSC22-098.jpg", family: [],
    levels: [
      { level: 1, cores: 0 },
      { level: 2, cores: 2 },
    ],
    effects: [
      { condition: "[LV1][LV2] (Your Attack Step)", text: "All attacking Spirits you control gain +1000 BP." },
      { condition: "[LV2] (Your Attack Step)", text: "The opponents must block your first attack this turn." },
    ],
  },
  bs01098TheBurningBattlefieldRevival: {
    id: "bs01098TheBurningBattlefieldRevival", format: "Eternal", set: "bs01",
    name: "The Burning Battlefield (Revival)", jpName: "燃えさかる戦場", rarity: "Uncommon",
    type: "nexus", color: "red", cost: 3, reduction: 2, symbols: 1, exsymbols: false,
    bp: 0, image: "./assets/cards/BSC22-098.jpg", family: [],
    levels: [
      { level: 1, cores: 0 },
      { level: 2, cores: 2 },
    ],
    effects: [
      { condition: "[LV1][LV2] (Your Attack Step)", text: "All attacking spirits you control get +3000 BP." },
      { condition: "[LV2] (Your Attack Step)", text: "The opponent must block your first attack this turn with Spirit(s) if possible." },
    ],
  },
  bs01099TheCanyonWhereSageLives: {
    id: "bs01099TheCanyonWhereSageLives", format: "Eternal", set: "bs01",
    name: "The Canyon Where Sage lives", jpName: "百識の谷", rarity: "Uncommon",
    type: "nexus", color: "red", cost: 4, reduction: 2, symbols: 1, exsymbols: false,
    bp: 0, image: "./assets/cards/BSC22-099.jpg", family: [],
    levels: [
      { level: 1, cores: 0 },
      { level: 2, cores: 3 },
    ],
    effects: [
      { condition: "[LV1] (Your Draw Step)", text: "Increase the number of cards you draw by +1. After you draw, discard a card from your Hand." },
      { condition: "[LV2] (Your Draw Step)", text: "Increase the number of cards you draw by +1." },
    ],
  },
  bs01099TheCanyonWhereSageLivesRevival: {
    id: "bs01099TheCanyonWhereSageLivesRevival", format: "Eternal", set: "bs01",
    name: "The Canyon Where Sage lives (Revival)", jpName: "百識の谷", rarity: "Uncommon",
    type: "nexus", color: "red", cost: 4, reduction: 2, symbols: 1, exsymbols: false,
    bp: 0, image: "./assets/cards/BSC22-099_bsc36-1.webp", family: [],
    levels: [
      { level: 1, cores: 0 },
      { level: 2, cores: 3 },
    ],
    effects: [
      { condition: "[LV1] (Your Draw Step)", text: "Increase the amount of cards you draw by +1. After you draw, discard a card from your Hand." },
      { condition: "[LV2] (Your Draw Step)", text: "Increase the amount of cards you draw by +1. Also, if your Life is two or less, increase the amount of cards you draw by +1." },
    ],
  },
  bs01100TheRubySun: {
    id: "bs01100TheRubySun", format: "Eternal", set: "bs01",
    name: "The Ruby Sun", jpName: "ルビーの太陽", rarity: "Common",
    type: "nexus", color: "red", cost: 5, reduction: 3, symbols: 1, exsymbols: false,
    bp: 0, image: "./assets/cards/BS01-100.jpg", family: [],
    levels: [
      { level: 1, cores: 0 },
      { level: 2, cores: 2 },
    ],
    effects: [
      { condition: "[LV1][LV2] (Permanent)", text: "When using a White card, unless the player pays one extra cost, it can't be used." },
      { condition: "[LV2] (Permanent)", text: "Besides via Spirit/Nexus/Magic effects, when cores are put onto, or removed from a White Spirit, exhaust it." },
    ],
  },
  bs01100TheRubySunRevival: {
    id: "bs01100TheRubySunRevival", format: "Eternal", set: "bs01",
    name: "The Ruby Sun (Revival)", jpName: "ルビーの太陽", rarity: "Common",
    type: "nexus", color: "red", cost: 5, reduction: 3, symbols: 1, exsymbols: false,
    bp: 0, image: "./assets/cards/BSC22-100.jpg", family: [],
    levels: [
      { level: 1, cores: 0 },
      { level: 2, cores: 2 },
    ],
    effects: [
      { condition: "[LV1][LV2] (Permanent)", text: "When the opponent would use a Green/White card, unless they pay one extra cost, it can't be used." },
      { condition: "[LV2] (Permanent)", text: "Besides via Spirit/Nexus/Magic effects, when cores are put onto, or removed from an opposing Green/White Spirit, exhaust it." },
    ],
  },
  bs01101TheAncientDragonTerritory: {
    id: "bs01101TheAncientDragonTerritory", format: "Eternal", set: "bs01",
    name: "The Ancient Dragon Territory", jpName: "古龍の縄張り", rarity: "Common",
    type: "nexus", color: "red", cost: 6, reduction: 3, symbols: 1, exsymbols: false,
    bp: 0, image: "./assets/cards/BSC22-101.jpg", family: [],
    levels: [
      { level: 1, cores: 0 },
      { level: 2, cores: 3 },
    ],
    effects: [
      { condition: "[LV1][LV2] (Your Turn)", text: "When a Spirit is destroyed, send the cores on that Spirit to its owner's Trash, instead of the Reserve." },
      { condition: "[LV2] (Your Attack Step)", text: "When only the opposing Spirit is destroyed by BP comparison, draw a card." },
    ],
  },
  bs01101TheAncientDragonTerritoryRevival: {
    id: "bs01101TheAncientDragonTerritoryRevival", format: "Eternal", set: "bs01",
    name: "The Ancient Dragon Territory (Revival)", jpName: "古龍の縄張り", rarity: "Common",
    type: "nexus", color: "red", cost: 6, reduction: 3, symbols: 1, exsymbols: false,
    bp: 0, image: "./assets/cards/BSC22-101.jpg", family: [],
    levels: [
      { level: 1, cores: 0 },
      { level: 2, cores: 3 },
    ],
    effects: [
      { condition: "[LV1][LV2] (Your Turn)", text: "When an opposing Spirit is destroyed, one of its cores is sent to the Void, not the Reserve." },
      { condition: "[LV2] (Your Attack Step)", text: "When an opposing spirit is destroyed, you can summon an \"Ancient Dragon\" family Spirit card from your Hand, without paying the cost." },
    ],
  },
  bs01102TheLostOfOldCastle: {
    id: "bs01102TheLostOfOldCastle", format: "Eternal", set: "bs01",
    name: "The Lost of Old Castle", jpName: "主無き古城", rarity: "Common",
    type: "nexus", color: "purple", cost: 4, reduction: 2, symbols: 1, exsymbols: false,
    bp: 0, image: "./assets/cards/BS01-102.jpg", family: [],
    levels: [
      { level: 1, cores: 0 },
      { level: 2, cores: 2 },
    ],
    effects: [
      { condition: "[LV1][LV2] (Permanent)", text: "All your Purple Spirits gain +1000 BP." },
      { condition: "[LV2] (Your Start Step)", text: "If both players have the same number of cards in Hand, or the opponent has more cards than you, draw a card." },
    ],
  },
   bs01102TheLostOfOldCastleRevival: {
    id: "bs01102TheLostOfOldCastleRevival", format: "Eternal", set: "bs01",
    name: "The Lost of Old Castle (Revival)", jpName: "主無き古城", rarity: "Common",
    type: "nexus", color: "purple", cost: 4, reduction: 2, symbols: 1, exsymbols: false,
    bp: 0, image: "./assets/cards/BSC22-102.webp", family: [],
    levels: [
      { level: 1, cores: 0 },
      { level: 2, cores: 2 },
    ],
    effects: [
      { condition: "[LV1][LV2] (Permanent)", text: "All your Purple Spirits gain +2000 BP." },
      { condition: "[LV2] (Your Start Step)", text: "If both players have the same number of cards in Hand, or the opponent has more cards than you, you can summon any number of Cost 3 or less Spirit cards from your Trash." },
    ],
  },
  bs01103TheSwampOfDrainLife: {
    id: "bs01103TheSwampOfDrainLife", format: "Eternal", set: "bs01",
    name: "The Swamp of Drain Life", jpName: "命を吸う沼", rarity: "Uncommon",
    type: "nexus", color: "purple", cost: 5, reduction: 2, symbols: 1, exsymbols: false,
    bp: 0, image: "./assets/cards/Drainlife1.webp", family: [],
    levels: [
      { level: 1, cores: 0 },
      { level: 2, cores: 3 },
    ],
    effects: [
      { condition: "[LV1][LV2] (Your Start Step)", text: "Send all cores from the opposing Reserve to their Trash." },
      { condition: "[LV2] (Your Start Step)", text: "Exhaust an opposing Spirit." },
    ],
  },
  bs01103TheSwampOfDrainLifeRevival: {
    id: "bs01103TheSwampOfDrainLifeRevival", format: "Eternal", set: "bs01",
    name: "The Swamp of Drain Life (Revival)", jpName: "命を吸う沼", rarity: "Uncommon",
    type: "nexus", color: "purple", cost: 5, reduction: 2, symbols: 1, exsymbols: false,
    bp: 0, image: "./assets/cards/Drainlife1.webp", family: [],
    levels: [
      { level: 1, cores: 0 },
      { level: 2, cores: 3 },
    ],
    effects: [
      { condition: "[LV1][LV2] (Your Start Step)", text: "Send all cores from the opposing Reserve and one core from any opposing Spirit to their Trash." },
      { condition: "[LV2] (Your Start Step)", text: "For each \"Ogre Wizard\" family Spirit you control, send one core from any opposing Spirit(s) to the Reserve." },
    ],
  },
  bs01104TheHistoricBattlefieldOfTheCursed: {
    id: "bs01104TheHistoricBattlefieldOfTheCursed", format: "Eternal", set: "bs01",
    name: "The Historic Battlefield of the Cursed", jpName: "千本槍の古戦場", rarity: "Rare",
    type: "nexus", color: "purple", cost: 6, reduction: 3, symbols: 1, exsymbols: false,
    bp: 0, image: "./assets/cards/Historicbattlefield1.webp", family: [],
    levels: [
      { level: 1, cores: 0 },
      { level: 2, cores: 3 },
    ],
    effects: [
      { condition: "[LV1][LV2] (Permanent)", text: "Whenever an opposing Spirit is exhausted, draw a card." },
      { condition: "[LV2] (Your Attack Step)", text: "By sending a core from this Nexus to your Trash, destroy an opposing Spirit that blocked after this battle ends." },
    ],
  },
  bs01104TheHistoricBattlefieldOfTheCursedRevival: {
    id: "bs01104TheHistoricBattlefieldOfTheCursedRevival", format: "Eternal", set: "bs01",
    name: "The Historic Battlefield of the Cursed (Revival)", jpName: "千本槍の古戦場", rarity: "Rare",
    type: "nexus", color: "purple", cost: 6, reduction: 3, symbols: 2, exsymbols: false,
    bp: 0, image: "./assets/cards/BSC22-104.webp", family: [],
    levels: [
      { level: 1, cores: 0 },
      { level: 2, cores: 3 },
    ],
    effects: [
      { condition: "[LV1][LV2] (Permanent)", text: "Whenever an opposing Spirit/Ultimate is exhausted, draw a card from your deck." },
      { condition: "[LV2] (Your Attack Step)", text: "By sending Soul Core from this Nexus to your trash, destroy an opposing blocking Spirit/Ultimate." },
    ],
  },
  bs01105TheShacklesOfDoom: {
    id: "bs01105TheShacklesOfDoom", format: "Eternal", set: "bs01",
    name: "The Shackles of Doom", jpName: "魔帝の墓標", rarity: "Uncommon",
    type: "nexus", color: "purple", cost: 6, reduction: 3, symbols: 1, exsymbols: false,
    bp: 0, image: "./assets/cards/BS01-105.jpg", family: [],
    levels: [
      { level: 1, cores: 0 },
      { level: 2, cores: 3 },
    ],
    effects: [
      { condition: "[LV1][LV2] (Either Attack Step)", text: "Spirits with only one core on them can't attack/block." },
      { condition: "[LV2] (Either Attack Step)", text: "After attack declaration, a core must be sent from the Spirit that attacks to the Trash." },
    ],
  },
  bs01105TheShacklesOfDoomRevival: {
    id: "bs01105TheShacklesOfDoomRevival", format: "Eternal", set: "bs01",
    name: "The Shackles of Doom (Revival)", jpName: "魔帝の墓標", rarity: "Uncommon",
    type: "nexus", color: "purple", cost: 6, reduction: 3, symbols: 1, exsymbols: false,
    bp: 0, image: "./assets/cards/BSC22-105.webp", family: [],
    levels: [
      { level: 1, cores: 0 },
      { level: 2, cores: 3 },
    ],
    effects: [
      { condition: "[LV1][LV2] (Either Attack Step)", text: "Spirits/Ultimates with one core on them can't attack/block." },
      { condition: "[LV2] (Either Attack Step)", text: "Unless the opponent sends two cores from the Spirit/Ultimate that would attack to the Trash, they can't attack." },
    ],
  },
  bs01106TheHermitWiseTree: {
    id: "bs01106TheHermitWiseTree", format: "Eternal", set: "bs01",
    name: "The Hermit Wise Tree", jpName: "隠されたる賢者の樹", rarity: "Rare",
    type: "nexus", color: "green", cost: 4, reduction: 2, symbols: 1, exsymbols: false,
    bp: 0, image: "./assets/cards/BSC22-106.jpg", family: [],
    levels: [
      { level: 1, cores: 0 },
      { level: 2, cores: 3 },
    ],
    effects: [
      { condition: "[LV1][LV2] (Either Attack Step)", text: "For each exhausted Spirit you control, all attacking/blocking Spirits you control gain +1000 BP." },
      { condition: "[LV2] (Your End Step)", text: "Refresh all Spirits you control." },
    ],
  },
  bs01106TheHermitWiseTreeRevival: {
    id: "bs01106TheHermitWiseTreeRevival", format: "Eternal", set: "bs01",
    name: "The Hermit Wise Tree (Revival)", jpName: "隠されたる賢者の樹", rarity: "Rare",
    type: "nexus", color: "green", cost: 4, reduction: 2, symbols: 1, exsymbols: false,
    bp: 0, image: "./assets/cards/BSC22-106.jpg", family: [],
    levels: [
      { level: 1, cores: 0 },
      { level: 2, cores: 3 },
    ],
    effects: [
      { condition: "[LV1][LV2] (Either Attack Step)", text: "When comparing BP, for each exhausted Spirit you control, all your battling Spirits gain +1000 BP." },
      { condition: "[LV2] (Your End Step)", text: "Refresh all Spirits you control. If there is Soul Core on this Nexus, also, put a core from the Void to each of all your Spirits that refreshed." },
    ],
  },
  bs01107TheFruitOfLife: {
    id: "bs01107TheFruitOfLife", format: "Eternal", set: "bs01",
    name: "The Fruit of Life", jpName: "命の果実", rarity: "Uncommon",
    type: "nexus", color: "green", cost: 4, reduction: 3, symbols: 1, exsymbols: false,
    bp: 0, image: "./assets/cards/BSC22-107.jpg", family: [],
    levels: [
      { level: 1, cores: 0 },
      { level: 2, cores: 3 },
    ],
    effects: [
      { condition: "[LV1][LV2] (When Life Reduced by Opponent)", text: "Draw a card." },
      { condition: "[LV2] (When Life Reduced by Opponent)", text: "Put a core from the Void to your Reserve." },
    ],
  },
  bs01107TheFruitOfLifeRevival: {
    id: "bs01107TheFruitOfLifeRevival", format: "Eternal", set: "bs01",
    name: "The Fruit of Life (Revival)", jpName: "命の果実", rarity: "Uncommon",
    type: "nexus", color: "green", cost: 4, reduction: 3, symbols: 1, exsymbols: false,
    bp: 0, image: "./assets/cards/BSC22-107.jpg", family: [],
    levels: [
      { level: 1, cores: 0 },
      { level: 2, cores: 3 },
    ],
    effects: [
      { condition: "[LV1][LV2] (When Life Reduced by Opponent)", text: "Draw a card." },
      { condition: "[LV2] (When Life Reduced by Opponent)", text: "Put a core from the Void to your Reserve, and exhaust an opposing Spirit." },
    ],
  },
  bs01108TheAnthill: {
    id: "bs01108TheAnthill", format: "Eternal", set: "bs01",
    name: "The Anthill", jpName: "無限蟲の蟻塚", rarity: "Uncommon",
    type: "nexus", color: "green", cost: 5, reduction: 2, symbols: 1, exsymbols: false,
    bp: 0, image: "./assets/cards/BSC22-108.jpg", family: [],
    levels: [
      { level: 1, cores: 0 },
      { level: 2, cores: 2 },
    ],
    effects: [
      { condition: "[LV1][LV2] (Opposing Attack Step)", text: "When only the opposing attacking Spirit is destroyed by comparing BP during battle, refresh the blocking Spirit you control." },
      { condition: "[LV2] (Your Attack Step)", text: "When only the opposing blocking Spirit is destroyed by comparing BP, refresh the attacking Spirit you control." },
    ],
  },
  bs01108TheAnthillRevival: {
    id: "bs01108TheAnthillRevival", format: "Eternal", set: "bs01",
    name: "The Anthill (Revival)", jpName: "無限蟲の蟻塚", rarity: "Uncommon",
    type: "nexus", color: "green", cost: 5, reduction: 2, symbols: 1, exsymbols: false,
    bp: 0, image: "./assets/cards/BSC22-108.jpg", family: [],
    levels: [
      { level: 1, cores: 0 },
      { level: 2, cores: 2 },
    ],
    effects: [
      { condition: "[LV1][LV2] (Opposing Attack Step)", text: "When only the opposing Spirit is destroyed by comparing BP, refresh the blocking Spirit you control." },
      { condition: "[LV2] (Your Attack Step)", text: "When only the opposing Spirit is destroyed by comparing BP, refresh a Spirit you control, and you can summon a \"Parasite\" family Spirit card from your Hand, without paying the cost." },
    ],
  },
  bs01109TheHillOfViolentWind: {
    id: "bs01109TheHillOfViolentWind", format: "Eternal", set: "bs01",
    name: "The Hill of Violent Wind", jpName: "風吹く丘陵", rarity: "Common",
    type: "nexus", color: "green", cost: 5, reduction: 2, symbols: 1, exsymbols: false,
    bp: 0, image: "./assets/cards/BS01-109.jpg", family: [],
    levels: [
      { level: 1, cores: 0 },
      { level: 2, cores: 2 },
    ],
    effects: [
      { condition: "[LV1][LV2] (Opposing Start Step)", text: "Refresh a Spirit with High Speed you control." },
      { condition: "[LV2] (Permanent)", text: "When your Spirit is summoned, during this turn, it gets +1000 BP." },
    ],
  },
  bs01109TheHillOfViolentWindRevival: {
    id: "bs01109TheHillOfViolentWindRevival", format: "Eternal", set: "bs01",
    name: "The Hill of Violent Wind (Revival)", jpName: "風吹く丘陵", rarity: "Common",
    type: "nexus", color: "green", cost: 5, reduction: 2, symbols: 1, exsymbols: false,
    bp: 0, image: "./assets/cards/BSC22-109.jpg", family: [],
    levels: [
      { level: 1, cores: 0 },
      { level: 2, cores: 2 },
    ],
    effects: [
      { condition: "[LV1][LV2] (Opposing Start Step)", text: "Refresh every Spirit with High Speed/Wind Storm/Bunshin you control." },
      { condition: "[LV2] (Permanent)", text: "When your Spirit is summoned, during this turn it gets +4000 BP." },
    ],
  },
  bs01110TheTimelessIceField: {
    id: "bs01110TheTimelessIceField", format: "Eternal", set: "bs01",
    name: "The Timeless Ice Field", jpName: "時止まりの氷原", rarity: "Uncommon",
    type: "nexus", color: "white", cost: 3, reduction: 2, symbols: 1, exsymbols: false,
    bp: 0, image: "./assets/cards/BSC22-110.jpg", family: [],
    levels: [
      { level: 1, cores: 0 },
      { level: 2, cores: 2 },
    ],
    effects: [
      { condition: "[LV1][LV2] (Opposing Attack Step)", text: "All blocking Spirits you control get +1000 BP." },
      { condition: "[LV2] (Opposing Start Step)", text: "Target an opposing Spirit. That Spirit must attack this turn." },
    ],
  },
  bs01110TheTimelessIceFieldRevival: {
    id: "bs01110TheTimelessIceFieldRevival", format: "Eternal", set: "bs01",
    name: "The Timeless Ice Field (Revival)", jpName: "時止まりの氷原", rarity: "Uncommon",
    type: "nexus", color: "white", cost: 3, reduction: 2, symbols: 1, exsymbols: false,
    bp: 0, image: "./assets/cards/BSC22-110.jpg", family: [],
    levels: [
      { level: 1, cores: 0 },
      { level: 2, cores: 2 },
    ],
    effects: [
      { condition: "[LV1][LV2] (Opposing Attack Step)", text: "All blocking Spirits you control get +3000 BP." },
      { condition: "[LV2] (Start of Opposing Attack Step)", text: "You can target an opposing Spirit. That Spirit must attack at the start of the attack step if possible." },
    ],
  },
  bs01111TheDiamondMoon: {
    id: "bs01111TheDiamondMoon", format: "Eternal", set: "bs01",
    name: "The Diamond Moon", jpName: "ダイヤモンドの月", rarity: "Common",
    type: "nexus", color: "white", cost: 5, reduction: 3, symbols: 1, exsymbols: false,
    bp: 0, image: "./assets/cards/BS01-111.jpg", family: [],
    levels: [
      { level: 1, cores: 0 },
      { level: 2, cores: 3 },
    ],
    effects: [
      { condition: "[LV1][LV2] (Either Attack Step)", text: "When blocked by opposing Red Spirits, or when blocking an opposing Spirit, your Spirits get +1000 BP." },
      { condition: "[LV2] (Either Attack Step)", text: "Destroy the opposing Red Spirit that battled with your Spirit at the end of the battle." },
    ],
  },
  bs01111TheDiamondMoonRevival: {
    id: "bs01111TheDiamondMoonRevival", format: "Eternal", set: "bs01",
    name: "The Diamond Moon (Revival)", jpName: "ダイヤモンドの月", rarity: "Common",
    type: "nexus", color: "white", cost: 5, reduction: 3, symbols: 1, exsymbols: false,
    bp: 0, image: "./assets/cards/BSC22-111.jpg", family: [],
    levels: [
      { level: 1, cores: 0 },
      { level: 2, cores: 3 },
    ],
    effects: [
      { condition: "[LV1][LV2] (Either Attack Step)", text: "When blocked by opposing Red/Purple Spirits, or when blocking an opposing Spirit, your Spirits get +3000 BP." },
      { condition: "[LV2] (Either Attack Step)", text: "Destroy an opposing Red/Purple Spirit that battled with your Spirit at the end of the battle." },
    ],
  },
  bs01112TheCastleOfEternalSnow: {
    id: "bs01112TheCastleOfEternalSnow", format: "Eternal", set: "bs01",
    name: "The Castle of Eternal Snow", jpName: "千年雪の尖塔", rarity: "Uncommon",
    type: "nexus", color: "white", cost: 5, reduction: 3, symbols: 1, exsymbols: false,
    bp: 0, image: "./assets/cards/BS01-112.jpg", family: [],
    levels: [
      { level: 1, cores: 0 },
      { level: 2, cores: 4 },
    ],
    effects: [
      { condition: "[LV1][LV2] (Your Start Step)", text: "Return an opposing Nexus to the Hand." },
      { condition: "[LV2] (Your Start Step)", text: "Return a Spirit to its owner's Hand." },
    ],
  },
  bs01112TheCastleOfEternalSnowRevival: {
    id: "bs01112TheCastleOfEternalSnowRevival", format: "Eternal", set: "bs01",
    name: "The Castle of Eternal Snow (Revival)", jpName: "千年雪の尖塔", rarity: "Uncommon",
    type: "nexus", color: "white", cost: 5, reduction: 3, symbols: 1, exsymbols: false,
    bp: 0, image: "./assets/cards/BSC22-112.jpg", family: [],
    levels: [
      { level: 1, cores: 0 },
      { level: 2, cores: 4 },
    ],
    effects: [
      { condition: "[LV1][LV2] (Your Start Step)", text: "Return an opposing Nexus to the hand. When Soul Core is on this Nexus, instead, return an opposing Nexus to the decktop." },
      { condition: "[LV2] (Your Start Step)", text: "Return an opposing Spirit/Ultimate to the hand." },
    ],
  },
  bs01113TheInvadedSilverSnow: {
    id: "bs01113TheInvadedSilverSnow", format: "Eternal", set: "bs01",
    name: "The Invaded Silver Snow", jpName: "侵食されゆく銀世界", rarity: "Common",
    type: "nexus", color: "white", cost: 5, reduction: 3, symbols: 1, exsymbols: false,
    bp: 0, image: "./assets/cards/BSC22-113.jpg", family: [],
    levels: [
      { level: 1, cores: 0 },
      { level: 2, cores: 4 },
    ],
    effects: [
      { condition: "[LV1][LV2] (Opposing Attack Step)", text: "At the start of the step, send all cores from the Trash to your Reserve." },
      { condition: "[LV2] (Opposing Attack Step)", text: "When your Spirit is destroyed, put a core from the Void to your Reserve." },
    ],
  },
  bs01113TheInvadedSilverSnowRevival: {
    id: "bs01113TheInvadedSilverSnowRevival", format: "Eternal", set: "bs01",
    name: "The Invaded Silver Snow (Revival)", jpName: "侵食されゆく銀世界", rarity: "Common",
    type: "nexus", color: "white", cost: 5, reduction: 3, symbols: 1, exsymbols: false,
    bp: 0, image: "./assets/cards/BSC22-113.jpg", family: [],
    levels: [
      { level: 1, cores: 0 },
      { level: 2, cores: 4 },
    ],
    effects: [
      { condition: "[LV1][LV2] (Start of Opposing Attack Step)", text: "Send all cores from the Trash to your Reserve. When Soul Core is sent to the Reserve by this effect, refresh all your \"Machine\" family Spirits." },
      { condition: "[LV2] (Opposing Attack Step)", text: "When Spirits you control are depleted/destroyed by opposing effects, put two cores from the Void to your Reserve." },
    ],
  },
  bs01114BusterSpear: {
    id: "bs01114BusterSpear", format: "Eternal", set: "bs01",
    name: "Buster Spear", jpName: "バスタースピア", rarity: "Rare",
    type: "magic", color: "red", cost: 3, reduction: 2, symbols: 0, exsymbols: false,
    bp: 0, image: "./assets/cards/BS01-114.jpg", family: [],
    levels: [],
    effects: [
      { condition: "Flash", text: "Destroy a Nexus. If an opposing Nexus is destroyed, draw a card." },
    ],
  },
  bs01114BusterSpearRevival: {
    id: "bs01114BusterSpearRevival", format: "Eternal", set: "bs01",
    name: "Buster Spear (Revival)", jpName: "バスタースピア", rarity: "Rare",
    type: "magic", color: "red", cost: 3, reduction: 2, symbols: 0, exsymbols: false,
    bp: 0, image: "./assets/cards/BSC22-114.jpg", family: [],
    levels: [],
    effects: [
      { condition: "Flash", text: "Destroy a Nexus you or the opponent controls. When this effect destroys any opposing Nexus, draw two cards." },
    ],
  },
  bs01115Awaken: {
    id: "bs01115Awaken", format: "Eternal", set: "bs01",
    name: "Awaken", jpName: "アウェイクン", rarity: "Common",
    type: "magic", color: "red", cost: 3, reduction: 1, symbols: 0, exsymbols: false,
    bp: 0, image: "./assets/cards/BSC22-115.jpg", family: [],
    levels: [],
    effects: [
      { condition: "Flash", text: "Send up to three cores from your Reserve to a Spirit you control, and draw a card." },
    ],
  },
  bs01115AwakenRevival: {
    id: "bs01115AwakenRevival", format: "Eternal", set: "bs01",
    name: "Awaken (Revival)", jpName: "アウェイクン", rarity: "Common",
    type: "magic", color: "red", cost: 3, reduction: 1, symbols: 0, exsymbols: false,
    bp: 0, image: "./assets/cards/BSC22-115.jpg", family: [],
    levels: [],
    effects: [
      { condition: "Flash", text: "Put up to three cores from your Reserve to a Spirit you control, and draw 1 card. If Soul Core was moved to your Spirit by this effect, during this turn, give that Spirit +5000 BP." },
    ],
  },
  bs01116OffensiveAura: {
    id: "bs01116OffensiveAura", format: "Eternal", set: "bs01",
    name: "Offensive Aura", jpName: "オフェンシブオーラ", rarity: "Common",
    type: "magic", color: "red", cost: 4, reduction: 2, symbols: 0, exsymbols: false,
    bp: 0, image: "./assets/cards/BSC22-116.jpg", family: [],
    levels: [],
    effects: [
      { condition: "Flash", text: "During this turn, all your attacking Spirits gain +2000 BP." },
    ],
  },
  bs01116OffensiveAuraRevival: {
    id: "bs01116OffensiveAuraRevival", format: "Eternal", set: "bs01",
    name: "Offensive Aura (Revival)", jpName: "オフェンシブオーラ", rarity: "Common",
    type: "magic", color: "red", cost: 4, reduction: 2, symbols: 0, exsymbols: false,
    bp: 0, image: "./assets/cards/BSC22-116.jpg", family: [],
    levels: [],
    effects: [
      { condition: "Flash", text: "During this turn, all your attacking spirits get +5000 BP." },
    ],
  },
  bs01117DoubleDraw: {
    id: "bs01117DoubleDraw", format: "Eternal", set: "bs01",
    name: "Double Draw", jpName: "ダブルドロー", rarity: "Common",
    type: "magic", color: "red", cost: 4, reduction: 2, symbols: 0, exsymbols: false,
    bp: 0, image: "./assets/cards/BS01-117.jpg", family: [],
    levels: [],
    effects: [
      { condition: "Main", text: "Draw two cards." },
      { condition: "Flash", text: "During this turn, give a Spirit +2000 BP." },
    ],
  },
  bs01117DoubleDrawRevival: {
    id: "bs01117DoubleDrawRevival", format: "Eternal", set: "bs01",
    name: "Double Draw (Revival)", jpName: "ダブルドロー", rarity: "Common",
    type: "magic", color: "red", cost: 4, reduction: 2, symbols: 0, exsymbols: false,
    bp: 0, image: "./assets/cards/BSC22-117.jpg", family: [],
    levels: [],
    effects: [
      { condition: "Main", text: "Draw two cards. Then, if Soul Core is used to pay the cost, you can summon an exactly-named \"The DragonEmperor Siegfried\" from your Hand, without paying the cost." },
      { condition: "Flash", text: "During this turn, give a Spirit +2000 BP." },
    ],
  },
  bs01118CallOfLost: {
    id: "bs01118CallOfLost", format: "Eternal", set: "bs01",
    name: "Call of Lost", jpName: "コールオブロスト", rarity: "Common",
    type: "magic", color: "red", cost: 4, reduction: 2, symbols: 0, exsymbols: false,
    bp: 0, image: "./assets/cards/BSC22-118.jpg", family: [],
    levels: [],
    effects: [
      { condition: "Main", text: "Choose and return a Spirit card from the Trash to your Hand." },
      { condition: "Flash", text: "During this turn, give a Spirit +2000 BP." },
    ],
  },
  bs01118CallOfLostRevival: {
    id: "bs01118CallOfLostRevival", format: "Eternal", set: "bs01",
    name: "Call of Lost (Revival)", jpName: "コールオブロスト", rarity: "Common",
    type: "magic", color: "red", cost: 4, reduction: 2, symbols: 0, exsymbols: false,
    bp: 0, image: "./assets/cards/BSC22-118.jpg", family: [],
    levels: [],
    effects: [
      { condition: "Main", text: "Return a Spirit/Ultimate card from the Trash to your Hand." },
      { condition: "Flash", text: "During this turn, give a Spirit +2000 BP." },
    ],
  },
  bs01119BurstFire: {
    id: "bs01119BurstFire", format: "Eternal", set: "bs01",
    name: "Burst Fire", jpName: "バーストファイア", rarity: "Common",
    type: "magic", color: "red", cost: 4, reduction: 2, symbols: 0, exsymbols: false,
    bp: 0, image: "./assets/cards/BSC22-119.jpg", family: [],
    levels: [],
    effects: [
      { condition: "Flash", text: "Negate the \"cannot block\" effect of a Spirit you control." },
    ],
  },
  bs01119BurstFireRevival: {
    id: "bs01119BurstFireRevival", format: "Eternal", set: "bs01",
    name: "Burst Fire (Revival)", jpName: "バーストファイア", rarity: "Common",
    type: "magic", color: "red", cost: 4, reduction: 2, symbols: 0, exsymbols: false,
    bp: 0, image: "./assets/cards/BSC22-119.jpg", family: [],
    levels: [],
    effects: [
      { condition: "Flash", text: "Refresh all your Spirits with \"cannot block\" effects. Then, during this turn, negate all \"cannot block\" effects of your Spirits. This effect can only be used on (Opposing Attack Step)." },
    ],
  },
  bs01120BusterPhalanx: {
    id: "bs01120BusterPhalanx", format: "Eternal", set: "bs01",
    name: "Buster Phalanx", jpName: "バスターファランクス", rarity: "Uncommon",
    type: "magic", color: "red", cost: 5, reduction: 2, symbols: 0, exsymbols: false,
    bp: 0, image: "./assets/cards/BS01-120.jpg", family: [],
    levels: [],
    effects: [
      { condition: "Main", text: "Destroy all Nexuses." },
      { condition: "Flash", text: "During this turn, give a Spirit +4000 BP." },
    ],
  },
  bs01120BusterPhalanxRevival: {
    id: "bs01120BusterPhalanxRevival", format: "Eternal", set: "bs01",
    name: "Buster Phalanx (Revival)", jpName: "バスターファランクス", rarity: "Uncommon",
    type: "magic", color: "red", cost: 5, reduction: 2, symbols: 0, exsymbols: false,
    bp: 0, image: "./assets/cards/BSC22-120.jpg", family: [],
    levels: [],
    effects: [
      { condition: "Main", text: "Destroy all Nexuses." },
      { condition: "Flash", text: "If Soul Core was used to pay the cost, destroy all opposing Nexuses." },
    ],
  },
  bs01121FlameDance: {
    id: "bs01121FlameDance", format: "Eternal", set: "bs01",
    name: "Flame Dance", jpName: "フレイムダンス", rarity: "Common",
    type: "magic", color: "red", cost: 5, reduction: 3, symbols: 0, exsymbols: false,
    bp: 0, image: "./assets/cards/BSC22-121.jpg", family: [],
    levels: [],
    effects: [
      { condition: "Flash", text: "Destroy a 4000 BP or less Spirit." },
    ],
  },
  bs01121FlameDanceRevival: {
    id: "bs01121FlameDanceRevival", format: "Eternal", set: "bs01",
    name: "Flame Dance (Revival)", jpName: "フレイムダンス", rarity: "Common",
    type: "magic", color: "red", cost: 5, reduction: 3, symbols: 0, exsymbols: false,
    bp: 0, image: "./assets/cards/BSC22-121.jpg", family: [],
    levels: [],
    effects: [
      { condition: "Flash", text: "Destroy a 4000 BP or less Spirit/Ultimate. If Soul Core was used to pay the cost, instead, destroy an opposing 10000 BP or less Spirit/Ultimate." },
    ],
  },
  bs01122FlameTempest: {
    id: "bs01122FlameTempest", format: "Eternal", set: "bs01",
    name: "Flame Tempest", jpName: "フレイムテンペスト", rarity: "Rare",
    type: "magic", color: "red", cost: 6, reduction: 2, symbols: 0, exsymbols: false,
    bp: 0, image: "./assets/cards/Card_02FlameTempest.webp", family: [],
    levels: [],
    effects: [
      { condition: "Flash", text: "Destroy all 3000 BP or less Spirits." },
    ],
  },
  bs01122FlameTempestRevival: {
    id: "bs01122FlameTempestRevival", format: "Eternal", set: "bs01",
    name: "Flame Tempest (Revival)", jpName: "フレイムテンペスト", rarity: "Rare",
    type: "magic", color: "red", cost: 6, reduction: 2, symbols: 0, exsymbols: false,
    bp: 0, image: "./assets/cards/BSC22-122.jpg", family: [],
    levels: [],
    effects: [
      { condition: "Flash", text: "Destroy all Spirits/Ultimates with 3000 BP or less. If Soul Core is used to pay the cost, instead, destroy all opposing Spirits/Ultimates with 7000 BP or less." },
    ],
  },
  bs01123ReturnDraw: {
    id: "bs01123ReturnDraw", format: "Eternal", set: "bs01",
    name: "Return Draw", jpName: "リターンドロー", rarity: "Common",
    type: "magic", color: "purple", cost: 2, reduction: 2, symbols: 0, exsymbols: false,
    bp: 0, image: "./assets/cards/BSC22-123.jpg", family: [],
    levels: [],
    effects: [
      { condition: "Main", text: "During this turn, when Spirits you control would return to your Hand, for each Spirit that would return, draw a card." },
      { condition: "Flash", text: "During this turn, give a Spirit +1000 BP." },
    ],
  },
  bs01123ReturnDrawRevival: {
    id: "bs01123ReturnDrawRevival", format: "Eternal", set: "bs01",
    name: "Return Draw (Revival)", jpName: "リターンドロー", rarity: "Common",
    type: "magic", color: "purple", cost: 2, reduction: 2, symbols: 0, exsymbols: false,
    bp: 0, image: "./assets/cards/BSC22-123.jpg", family: [],
    levels: [],
    effects: [
      { condition: "(Your Attack Step)", text: "Return one \"Return Draw\" from your Trash to your Hand. This effect can only be used once per turn." },
      { condition: "Main", text: "During this turn, for each Spirit you control returned to your Hand, draw a card." },
      { condition: "Flash", text: "During this turn, give a Spirit +1000 BP." },
    ],
  },
  bs01124EvilAura: {
    id: "bs01124EvilAura", format: "Eternal", set: "bs01",
    name: "Evil Aura", jpName: "イビルオーラ", rarity: "Uncommon",
    type: "magic", color: "purple", cost: 3, reduction: 2, symbols: 0, exsymbols: false,
    bp: 0, image: "./assets/cards/Evilaura1.jpg", family: [],
    levels: [],
    effects: [
      { condition: "Flash", text: "Put four cores from the Void to a Spirit. At the End Step, send four of your cores to the Void." },
    ],
  },
  bs01124EvilAuraRevival: {
    id: "bs01124EvilAuraRevival", format: "Eternal", set: "bs01",
    name: "Evil Aura (Revival)", jpName: "イビルオーラ", rarity: "Uncommon",
    type: "magic", color: "purple", cost: 3, reduction: 2, symbols: 0, exsymbols: false,
    bp: 0, image: "./assets/cards/Evilaura1.jpg", family: [],
    levels: [],
    effects: [
      { condition: "Flash", text: "Put four cores from the Void to a Spirit you control. At the End Step, send four of your cores to the Void. Also, if Soul Core was used to pay the cost, you can summon a \"SevenShogun\"-named Spirit card from your Trash, without paying the cost. At the End Step, destroy a Spirit summoned by this effect." },
    ],
  },
  bs01125DeadlyBalance: {
    id: "bs01125DeadlyBalance", format: "Eternal", set: "bs01",
    name: "Deadly Balance", jpName: "デッドリィバランス", rarity: "Common",
    type: "magic", color: "purple", cost: 3, reduction: 2, symbols: 0, exsymbols: false,
    bp: 0, image: "./assets/cards/BS01-125.jpg", family: [],
    levels: [],
    effects: [
      { condition: "Flash", text: "Both players destroy a Spirit they control." },
    ],
  },
  bs01125DeadlyBalanceRevival: {
    id: "bs01125DeadlyBalanceRevival", format: "Eternal", set: "bs01",
    name: "Deadly Balance (Revival)", jpName: "デッドリィバランス", rarity: "Common",
    type: "magic", color: "purple", cost: 3, reduction: 2, symbols: 0, exsymbols: false,
    bp: 0, image: "./assets/cards/BSC22-124.jpg", family: [],
    levels: [],
    effects: [
      { condition: "Flash", text: "The opponent destroys a Spirit they control. Then, you destroy a Spirit you control. If Soul Core was used to pay the cost, instead, the opponent destroys an Ultimate they control. Then, you destroy a Spirit you control." },
    ],
  },
  bs01126ShadowElixir: {
    id: "bs01126ShadowElixir", format: "Eternal", set: "bs01",
    name: "Shadow Elixir", jpName: "シャドウエリクサー", rarity: "Uncommon",
    type: "magic", color: "purple", cost: 4, reduction: 2, symbols: 0, exsymbols: false,
    bp: 0, image: "./assets/cards/BSC22-125.jpg", family: [],
    levels: [],
    effects: [
      { condition: "Flash", text: "Send a core from your Reserve to your Life." },
    ],
  },
  bs01126ShadowElixirRevival: {
    id: "bs01126ShadowElixirRevival", format: "Eternal", set: "bs01",
    name: "Shadow Elixir (Revival)", jpName: "シャドウエリクサー", rarity: "Uncommon",
    type: "magic", color: "purple", cost: 4, reduction: 2, symbols: 0, exsymbols: false,
    bp: 0, image: "./assets/cards/BSC22-125.jpg", family: [],
    levels: [],
    effects: [
      { condition: "Flash", text: "Send a core from the Reserve to your life. If Soul Core was used to pay the cost, also, draw one card from your deck." },
    ],
  },
  bs01127KillerTelescope: {
    id: "bs01127KillerTelescope", format: "Eternal", set: "bs01",
    name: "Killer Telescope", jpName: "キラーテレスコープ", rarity: "Common",
    type: "magic", color: "purple", cost: 4, reduction: 2, symbols: 0, exsymbols: false,
    bp: 0, image: "./assets/cards/BSC22-126.jpg", family: [],
    levels: [],
    effects: [
      { condition: "Main", text: "During this turn, Spirits you control may attack exhausted opposing Spirits." },
      { condition: "Flash", text: "During this turn, give a Spirit +2000 BP." },
    ],
  },
  bs01127KillerTelescopeRevival: {
    id: "bs01127KillerTelescopeRevival", format: "Eternal", set: "bs01",
    name: "Killer Telescope (Revival)", jpName: "キラーテレスコープ", rarity: "Common",
    type: "magic", color: "purple", cost: 4, reduction: 2, symbols: 0, exsymbols: false,
    bp: 0, image: "./assets/cards/BSC22-126.jpg", family: [],
    levels: [],
    effects: [
      { condition: "Main", text: "During this turn, all your Spirits can attack and attack an exhausted opposing Spirit. If Soul Core is used to pay the cost, also, all your Spirits get +3000 BP." },
      { condition: "Flash", text: "During this turn, give a Spirit +2000 BP." },
    ],
  },
  bs01128ChaosDraw: {
    id: "bs01128ChaosDraw", format: "Eternal", set: "bs01",
    name: "Chaos Draw", jpName: "カオスドロー", rarity: "Rare",
    type: "magic", color: "purple", cost: 5, reduction: 3, symbols: 0, exsymbols: false,
    bp: 0, image: "./assets/cards/BS01-128.jpg", family: [],
    levels: [],
    effects: [
      { condition: "Main", text: "Draw a card for each exhausted Spirit the opponent controls." },
      { condition: "Flash", text: "During this turn, give a Spirit +3000 BP." },
    ],
  },
  bs01128ChaosDrawRevival: {
    id: "bs01128ChaosDrawRevival", format: "Eternal", set: "bs01",
    name: "Chaos Draw (Revival)", jpName: "カオスドロー", rarity: "Rare",
    type: "magic", color: "purple", cost: 5, reduction: 3, symbols: 0, exsymbols: false,
    bp: 0, image: "./assets/cards/BSC22-127.jpg", family: [],
    levels: [],
    effects: [
      { condition: "Main", text: "Draw a card for each exhausted Spirit the opponent controls. If Soul Core is used to pay the cost, instead, destroy all exhausted opposing Spirits, and draw a card for each Spirit destroyed." },
      { condition: "Flash", text: "During this turn, give a Spirit +3000 BP." },
    ],
  },
  bs01129PoisonShoot: {
    id: "bs01129PoisonShoot", format: "Eternal", set: "bs01",
    name: "Poison Shoot", jpName: "ポイズンシュート", rarity: "Common",
    type: "magic", color: "purple", cost: 5, reduction: 3, symbols: 0, exsymbols: false,
    bp: 0, image: "./assets/cards/BS01-129.jpg", family: [],
    levels: [],
    effects: [
      { condition: "Flash", text: "Send a core from a Spirit to its owner's Reserve." },
    ],
  },
  bs01129PoisonShootRevival: {
    id: "bs01129PoisonShootRevival", format: "Eternal", set: "bs01",
    name: "Poison Shoot (Revival)", jpName: "ポイズンシュート", rarity: "Common",
    type: "magic", color: "purple", cost: 5, reduction: 3, symbols: 0, exsymbols: false,
    bp: 0, image: "./assets/cards/BSC22-128.jpg", family: [],
    levels: [],
    effects: [
      { condition: "Flash", text: "Send a core from a Spirit to its owner's Reserve. If Soul Core was used to pay the cost, also, send two cores from the same Spirit to its owner's Reserve." },
    ],
  },
  bs01130ChangingCores: {
    id: "bs01130ChangingCores", format: "Eternal", set: "bs01",
    name: "Changing Cores", jpName: "チェンジングコア", rarity: "Common",
    type: "magic", color: "purple", cost: 5, reduction: 3, symbols: 0, exsymbols: false,
    bp: 0, image: "./assets/cards/Changingcore1.webp", family: [],
    levels: [],
    effects: [
      { condition: "Main", text: "Move all but 1 core from target spirit to other spirits that have the same controller as it." },
      { condition: "Flash", text: "During this turn, give a Spirit +3000 BP." },
    ],
  },
  bs01130ChangingCoresRevival: {
    id: "bs01130ChangingCoresRevival", format: "Eternal", set: "bs01",
    name: "Changing Cores (Revival)", jpName: "チェンジングコア", rarity: "Common",
    type: "magic", color: "purple", cost: 5, reduction: 3, symbols: 0, exsymbols: false,
    bp: 0, image: "./assets/cards/Changingcore1.webp", family: [],
    levels: [],
    effects: [
      { condition: "Flash", text: "Target a Spirit. Move up to two cores from that Spirit to another Spirit on the same field." },
    ],
  },
  bs01131DarkCoffin: {
    id: "bs01131DarkCoffin", format: "Eternal", set: "bs01",
    name: "Dark Coffin", jpName: "ダークコフィン", rarity: "Common",
    type: "magic", color: "purple", cost: 7, reduction: 3, symbols: 0, exsymbols: false,
    bp: 0, image: "./assets/cards/Darkcoffin1.webp", family: [],
    levels: [],
    effects: [
      { condition: "Main", text: "Destroy target exhausted spirit." },
      { condition: "Flash", text: "During this turn, give a Spirit +4000 BP." },
    ],
  },
  bs01131DarkCoffinRevival: {
    id: "bs01131DarkCoffinRevival", format: "Eternal", set: "bs01",
    name: "Dark Coffin (Revival)", jpName: "ダークコフィン", rarity: "Common",
    type: "magic", color: "purple", cost: 7, reduction: 3, symbols: 0, exsymbols: false,
    bp: 0, image: "./assets/cards/Darkcoffin1.webp", family: [],
    levels: [],
    effects: [
      { condition: "Flash", text: "Destroy an exhausted Spirit and an exhausted Ultimate." },
    ],
  },
  bs01132StormDraw: {
    id: "bs01132StormDraw", format: "Eternal", set: "bs01",
    name: "Storm Draw", jpName: "ストームドロー", rarity: "Common",
    type: "magic", color: "green", cost: 2, reduction: 1, symbols: 0, exsymbols: false,
    bp: 0, image: "./assets/cards/BS01-132.jpg", family: [],
    levels: [],
    effects: [
      { condition: "Main", text: "Draw 3 cards, then discard 2 cards." },
      { condition: "Flash", text: "During this turn, give a Spirit +3000 BP." },
    ],
  },
   bs01132StormDrawRevival: {
    id: "bs01132StormDrawRevival", format: "Eternal", set: "bs01",
    name: "Storm Draw (Revival)", jpName: "ストームドロー", rarity: "Common",
    type: "magic", color: "green", cost: 2, reduction: 1, symbols: 0, exsymbols: false,
    bp: 0, image: "./assets/cards/BS01-132.jpg", family: [],
    levels: [],
    effects: [
      { condition: "Main", text: "Draw 3 cards, then discard 2 cards." },
      { condition: "Flash", text: "Target spirit gets +3000BP until end of turn. If Soul Core (Soul Core) was used to pay the cost, additionally, all your Spirits/Ultimates with \"Kingtaurus\" in the name get +10000 BP until the end of this turn." },
    ],
  },
  bs01133WildPower: {
    id: "bs01133WildPower", format: "Eternal", set: "bs01",
    name: "Wild Power", jpName: "ワイルドパワー", rarity: "Common",
    type: "magic", color: "green", cost: 2, reduction: 2, symbols: 0, exsymbols: false,
    bp: 0, image: "./assets/cards/Wildpower1.webp", family: [],
    levels: [],
    effects: [
      { condition: "Flash", text: "During this turn, give a Spirit +2000 BP." },
    ],
  },
  bs01133WildPowerRevival: {
    id: "bs01133WildPowerRevival", format: "Eternal", set: "bs01",
    name: "Wild Power (Revival)", jpName: "ワイルドパワー", rarity: "Common",
    type: "magic", color: "green", cost: 2, reduction: 2, symbols: 0, exsymbols: false,
    bp: 0, image: "./assets/cards/Wildpower1.webp", family: [],
    levels: [],
    effects: [
      { condition: "Flash", text: "During this turn, give a Spirit +2000 BP. If there is Soul Core in your reserve, also, during this turn, give a Spirit +3000 BP." },
    ],
  },
  bs01134BindingThorn: {
    id: "bs01134BindingThorn", format: "Eternal", set: "bs01",
    name: "Binding Thorn", jpName: "バインディングソーン", rarity: "Common",
    type: "magic", color: "green", cost: 2, reduction: 2, symbols: 0, exsymbols: false,
    bp: 0, image: "./assets/cards/Bindingthorn1.webp", family: [],
    levels: [],
    effects: [
      { condition: "Flash", text: "Exhaust an opposing Spirit." },
    ],
  },
  bs01134BindingThornRevival: {
    id: "bs01134BindingThornRevival", format: "Eternal", set: "bs01",
    name: "Binding Thorn (Revival)", jpName: "バインディングソーン", rarity: "Common",
    type: "magic", color: "green", cost: 2, reduction: 2, symbols: 0, exsymbols: false,
    bp: 0, image: "./assets/cards/Bindingthorn1.webp", family: [],
    levels: [],
    effects: [
      { condition: "Flash", text: "Exhaust an opposing Spirit. When there is Soul Core in your reserve, also, during this turn, give a Spirit you control +3000 BP." },
    ],
  },
  bs01135PowerAura: {
    id: "bs01135PowerAura", format: "Eternal", set: "bs01",
    name: "Power Aura", jpName: "パワーオーラ", rarity: "Common",
    type: "magic", color: "green", cost: 3, reduction: 1, symbols: 0, exsymbols: false,
    bp: 0, image: "./assets/cards/Poweraura1.webp", family: [],
    levels: [],
    effects: [
      { condition: "Flash", text: "Draw 1 card. During this turn, all your Spirits get +1000 BP." },
    ],
  },
  bs01135PowerAuraRevival: {
    id: "bs01135PowerAuraRevival", format: "Eternal", set: "bs01",
    name: "Power Aura (Revival)", jpName: "パワーオーラ", rarity: "Common",
    type: "magic", color: "green", cost: 3, reduction: 1, symbols: 0, exsymbols: false,
    bp: 0, image: "./assets/cards/Poweraura1.webp", family: [],
    levels: [],
    effects: [
      { condition: "Flash", text: "Draw 1 card from your deck. During this turn, all your Spirits/Ultimates get +3000 BP." },
    ],
  },
  bs01136GatherForces: {
    id: "bs01136GatherForces", format: "Eternal", set: "bs01",
    name: "Gather Forces", jpName: "ギャザーフォース", rarity: "Uncommon",
    type: "magic", color: "green", cost: 3, reduction: 2, symbols: 0, exsymbols: false,
    bp: 0, image: "./assets/cards/Gatherforces1.webp", family: [],
    levels: [],
    effects: [
      { condition: "Main", text: "Put a core from the Void to your Reserve." },
      { condition: "Flash", text: "During this turn, give a Spirit +1000 BP." },
    ],
  },
  bs01136GatherForcesRevival: {
    id: "bs01136GatherForcesRevival", format: "Eternal", set: "bs01",
    name: "Gather Forces (Revival)", jpName: "ギャザーフォース", rarity: "Uncommon",
    type: "magic", color: "green", cost: 3, reduction: 2, symbols: 0, exsymbols: false,
    bp: 0, image: "./assets/cards/Gatherforces1.webp", family: [],
    levels: [],
    effects: [
      { condition: "Main", text: "Put a core from the Void to your Reserve. If Soul Core was used to pay the cost, also, on your first attack of this turn, your opponent cannot activate their set burst." },
      { condition: "Flash", text: "During this turn, give a Spirit +1000 BP." },
    ],
  },
  bs01137RelationSoul: {
    id: "bs01137RelationSoul", format: "Eternal", set: "bs01",
    name: "Relation Soul", jpName: "リレイションソウル", rarity: "Common",
    type: "magic", color: "green", cost: 4, reduction: 3, symbols: 0, exsymbols: false,
    bp: 0, image: "./assets/cards/Relationsoul1.webp", family: [],
    levels: [],
    effects: [
      { condition: "Flash", text: "During this turn, give a Spirit +1000 BP for each exhausted Spirit the opponent controls." },
    ],
  },
  bs01137RelationSoulRevival: {
    id: "bs01137RelationSoulRevival", format: "Eternal", set: "bs01",
    name: "Relation Soul (Revival)", jpName: "リレイションソウル", rarity: "Common",
    type: "magic", color: "green", cost: 4, reduction: 3, symbols: 0, exsymbols: false,
    bp: 0, image: "./assets/cards/Relationsoul1.webp", family: [],
    levels: [],
    effects: [
      { condition: "Flash", text: "During this turn, for each exhausted opposing Spirit/Ultimate, give a Spirit +5000 BP." },
    ],
  },
  bs01138HandReverse: {
    id: "bs01138HandReverse", format: "Eternal", set: "bs01",
    name: "Hand Reverse", jpName: "ハンドリバース", rarity: "Uncommon",
    type: "magic", color: "green", cost: 5, reduction: 2, symbols: 0, exsymbols: false,
    bp: 0, image: "./assets/cards/BS01-138.jpg", family: [],
    levels: [],
    effects: [
      { condition: "Main", text: "Discard your entire Hand. Then, draw a card for each card in the opposing Hand." },
      { condition: "Flash", text: "During this turn, give a Spirit +3000 BP." },
    ],
  },
  bs01138HandReverseRevival: {
    id: "bs01138HandReverseRevival", format: "Eternal", set: "bs01",
    name: "Hand Reverse (Revival)", jpName: "ハンドリバース", rarity: "Uncommon",
    type: "magic", color: "green", cost: 5, reduction: 2, symbols: 0, exsymbols: false,
    bp: 0, image: "./assets/cards/BSC22-136.jpg", family: [],
    levels: [],
    effects: [
      { condition: "Main", text: "Discard your entire Hand (at least one card). Then, draw a card for each card in the opposing Hand. Also, if Soul Core is used to pay the cost, draw a card." },
      { condition: "Flash", text: "During this turn, give a Spirit +3000 BP." },
    ],
  },
  bs01139FeatherBarrier: {
    id: "bs01139FeatherBarrier", format: "Eternal", set: "bs01",
    name: "Feather Barrier", jpName: "フェザーバリア", rarity: "Common",
    type: "magic", color: "green", cost: 5, reduction: 3, symbols: 0, exsymbols: false,
    bp: 0, image: "./assets/cards/BS01-139.jpg", family: [],
    levels: [],
    effects: [
      { condition: "Flash", text: "During this turn, a blocking Spirit you control is unaffected by opposing cards' effects." },
    ],
  },
  bs01139FeatherBarrierRevival: {
    id: "bs01139FeatherBarrierRevival", format: "Eternal", set: "bs01",
    name: "Feather Barrier (Revival)", jpName: "フェザーバリア", rarity: "Common",
    type: "magic", color: "green", cost: 5, reduction: 3, symbols: 0, exsymbols: false,
    bp: 0, image: "./assets/cards/BSC22-137.jpg", family: [],
    levels: [],
    effects: [
      { condition: "Flash", text: "During this turn, one of your battling Spirits/Ultimates is unaffected by opposing effects." },
    ],
  },
  bs01140BindingWoods: {
    id: "bs01140BindingWoods", format: "Eternal", set: "bs01",
    name: "Binding Woods", jpName: "バインディングウッズ", rarity: "Rare",
    type: "magic", color: "green", cost: 7, reduction: 3, symbols: 0, exsymbols: false,
    bp: 0, image: "./assets/cards/Bindingwoods1.webp", family: [],
    levels: [],
    effects: [
      { condition: "Main", text: "Select 1 color. Exhaust all Spirits with the selected color." },
      { condition: "Flash", text: "During this turn, give a Spirit +5000 BP." },
    ],
  },
  bs01140BindingWoodsRevival: {
    id: "bs01140BindingWoodsRevival", format: "Eternal", set: "bs01",
    name: "Binding Woods (Revival)", jpName: "バインディングウッズ", rarity: "Rare",
    type: "magic", color: "green", cost: 7, reduction: 3, symbols: 0, exsymbols: false,
    bp: 0, image: "./assets/cards/BSC22-138.jpg", family: [],
    levels: [],
    effects: [
      { condition: "Main", text: "Select 1 color. Exhaust all Spirits with the selected color." },
      { condition: "Flash", text: "If Soul Core is used to pay the cost, select 1 color. Exhaust all Spirits with the selected color." },
    ],
  },
  bs01141InvisibleCloak: {
    id: "bs01141InvisibleCloak", format: "Eternal", set: "bs01",
    name: "Invisible Cloak", jpName: "インビジブルクローク", rarity: "Rare",
    type: "magic", color: "white", cost: 3, reduction: 2, symbols: 0, exsymbols: false,
    bp: 0, image: "./assets/cards/BS01-141.jpg", family: [],
    levels: [],
    effects: [
      { condition: "Flash", text: "Target a Spirit. During this turn, the targeted Spirit can't be blocked." },
    ],
  },
  bs01141InvisibleCloakRevival: {
    id: "bs01141InvisibleCloakRevival", format: "Eternal", set: "bs01",
    name: "Invisible Cloak (Revival)", jpName: "インビジブルクローク", rarity: "Rare",
    type: "magic", color: "white", cost: 3, reduction: 2, symbols: 0, exsymbols: false,
    bp: 0, image: "./assets/cards/BSC22-CP03.jpg", family: [],
    levels: [],
    effects: [
      { condition: "Flash", text: "During this turn, a Spirit you control can't be blocked. Also, if Soul Core was used to pay the cost, during this battle, all your \"Odin\" Spirits/Ultimates gain an extra White symbol." },
    ],
  },
  bs01142PureElixir: {
    id: "bs01142PureElixir", format: "Eternal", set: "bs01",
    name: "Pure Elixir", jpName: "ピュアエリクサー", rarity: "Common",
    type: "magic", color: "white", cost: 3, reduction: 2, symbols: 0, exsymbols: false,
    bp: 0, image: "./assets/cards/Pureelixir1.webp", family: [],
    levels: [],
    effects: [
      { condition: "Flash", text: "Refresh all exhausted Spirits you control. During this turn, the Spirits refreshed by this effect cannot attack." },
    ],
  },
  bs01142PureElixirRevival: {
    id: "bs01142PureElixirRevival", format: "Eternal", set: "bs01",
    name: "Pure Elixir (Revival)", jpName: "ピュアエリクサー", rarity: "Common",
    type: "magic", color: "white", cost: 3, reduction: 2, symbols: 0, exsymbols: false,
    bp: 0, image: "./assets/cards/Pureelixir1.webp", family: [],
    levels: [],
    effects: [
      { condition: "Flash", text: "Refresh all your exhausted Spirits/Ultimates. During this turn, those Spirits/Ultimates refreshed cannot attack." },
    ],
  },
  bs01143DivineChain: {
    id: "bs01143DivineChain", format: "Eternal", set: "bs01",
    name: "Divine Chain", jpName: "ディバインチェイン", rarity: "Rare",
    type: "magic", color: "white", cost: 3, reduction: 3, symbols: 0, exsymbols: false,
    bp: 0, image: "./assets/cards/BS01-143.jpg", family: [],
    levels: [],
    effects: [
      { condition: "Flash", text: "Until the end of this battle, the opponent can't use any cards from the Hand during Flash Timing." },
    ],
  },
  bs01143DivineChainRevival: {
    id: "bs01143DivineChainRevival", format: "Eternal", set: "bs01",
    name: "Divine Chain (Revival)", jpName: "ディバインチェイン", rarity: "Rare",
    type: "magic", color: "white", cost: 3, reduction: 3, symbols: 0, exsymbols: false,
    bp: 0, image: "./assets/cards/BSC22-140.jpg", family: [],
    levels: [],
    effects: [
      { condition: "Flash", text: "During this battle, the opponent can't use any cards from their Hand during the Flash Timing. If Soul Core is on any of your Spirits, also, the opponent can't activate any Burst." },
    ],
  },
  bs01144SilentWall: {
    id: "bs01144SilentWall", format: "Eternal", set: "bs01",
    name: "Silent Wall", jpName: "サイレントウォール", rarity: "Uncommon",
    type: "magic", color: "white", cost: 4, reduction: 2, symbols: 0, exsymbols: false,
    bp: 0, image: "./assets/cards/Silentwall1.webp", family: [],
    levels: [],
    effects: [
      { condition: "Flash", text: "After this battle, end this Battle Phase." },
    ],
  },
  bs01144SilentWallRevival: {
    id: "bs01144SilentWallRevival", format: "Eternal", set: "bs01",
    name: "Silent Wall (Revival)", jpName: "サイレントウォール", rarity: "Uncommon",
    type: "magic", color: "white", cost: 4, reduction: 2, symbols: 0, exsymbols: false,
    bp: 0, image: "./assets/cards/Silentwall1.webp", family: [],
    levels: [],
    effects: [
      { condition: "Flash", text: "At the end of the battle, end the attack step. If your life is 2 or less, also, you can return an opposing non-battling Spirit to the hand." },
    ],
  },
  bs01145DefensiveAura: {
    id: "bs01145DefensiveAura", format: "Eternal", set: "bs01",
    name: "Defensive Aura", jpName: "ディフェンシブオーラ", rarity: "Common",
    type: "magic", color: "white", cost: 4, reduction: 2, symbols: 0, exsymbols: false,
    bp: 0, image: "./assets/cards/Defensiveaura1.webp", family: [],
    levels: [],
    effects: [
      { condition: "Flash", text: "During this turn, all your blocking Spirits get +3000 BP." },
    ],
  },
  bs01145DefensiveAuraRevival: {
    id: "bs01145DefensiveAuraRevival", format: "Eternal", set: "bs01",
    name: "Defensive Aura (Revival)", jpName: "ディフェンシブオーラ", rarity: "Common",
    type: "magic", color: "white", cost: 4, reduction: 2, symbols: 0, exsymbols: false,
    bp: 0, image: "./assets/cards/Defensiveaura1.webp", family: [],
    levels: [],
    effects: [
      { condition: "Flash", text: "During this turn, all your blocking Spirits get +6000 BP. If Soul Core was used to pay the cost, also, all your \"The ImpregnableFortress Odin\" can block while exhausted." },
    ],
  },
  bs01146DreamRibbon: {
    id: "bs01146DreamRibbon", format: "Eternal", set: "bs01",
    name: "Dream Ribbon", jpName: "ドリームリボン", rarity: "Common",
    type: "magic", color: "white", cost: 4, reduction: 3, symbols: 0, exsymbols: false,
    bp: 0, image: "./assets/cards/Dreamribbon1.webp", family: [],
    levels: [],
    effects: [
      { condition: "Flash", text: "Return an opposing Spirit to the Hand." },
    ],
  },
  bs01146DreamRibbonRevival: {
    id: "bs01146DreamRibbonRevival", format: "Eternal", set: "bs01",
    name: "Dream Ribbon (Revival)", jpName: "ドリームリボン", rarity: "Common",
    type: "magic", color: "white", cost: 4, reduction: 3, symbols: 0, exsymbols: false,
    bp: 0, image: "./assets/cards/Dreamribbon1.webp", family: [],
    levels: [],
    effects: [
      { condition: "Flash", text: "Return an opposing Spirit to the Hand. If Soul Core was used to pay the cost, after this effect resolves, return an opposing 5000 BP or less Spirit to the Hand." },
    ],
  },
  bs01147DreamChest: {
    id: "bs01147DreamChest", format: "Eternal", set: "bs01",
    name: "Dream Chest", jpName: "ドリームチェスト", rarity: "Common",
    type: "magic", color: "white", cost: 5, reduction: 3, symbols: 0, exsymbols: false,
    bp: 0, image: "./assets/cards/Dreamchest1.webp", family: [],
    levels: [],
    effects: [
      { condition: "Flash", text: "Move target Spirit to the top of its owner's deck." },
    ],
  },
  bs01147DreamChestRevival: {
    id: "bs01147DreamChestRevival", format: "Eternal", set: "bs01",
    name: "Dream Chest (Revival)", jpName: "ドリームチェスト", rarity: "Common",
    type: "magic", color: "white", cost: 5, reduction: 3, symbols: 0, exsymbols: false,
    bp: 0, image: "./assets/cards/Dreamchest1.webp", family: [],
    levels: [],
    effects: [
      { condition: "Flash", text: "Return a Spirit to the top of its owner's deck. If Soul Core is used to pay the cost, instead, return an Ultimate to the top of its owner's deck." },
    ],
  },
  bs01148LeakDrive: {
    id: "bs01148LeakDrive", format: "Eternal", set: "bs01",
    name: "Leak Drive", jpName: "ラークドライブ", rarity: "Common",
    type: "magic", color: "white", cost: 6, reduction: 3, symbols: 0, exsymbols: false,
    bp: 0, image: "./assets/cards/Leakdrive1.webp", family: [],
    levels: [],
    effects: [
      { condition: "Flash", text: "End this battle." },
    ],
  },
  bs01148LeakDriveRevival: {
    id: "bs01148LeakDriveRevival", format: "Eternal", set: "bs01",
    name: "Leak Drive (Revival)", jpName: "ラークドライブ", rarity: "Common",
    type: "magic", color: "white", cost: 6, reduction: 3, symbols: 0, exsymbols: false,
    bp: 0, image: "./assets/cards/Leakdrive1.webp", family: [],
    levels: [],
    effects: [
      { condition: "Flash", text: "Immediately end this battle. If Soul Core is used to pay the cost, also, return an opposing Spirit/Ultimate to the hand." },
    ],
  },
  bs01149AttackShift: {
    id: "bs01149AttackShift", format: "Eternal", set: "bs01",
    name: "Attack Shift", jpName: "アタックシフト", rarity: "Common",
    type: "magic", color: "white", cost: 7, reduction: 3, symbols: 0, exsymbols: false,
    bp: 0, image: "./assets/cards/Attackshift1.webp", family: [],
    levels: [],
    effects: [
      { condition: "Main", text: "During this turn, all (When Blocks) effects of Spirits activate as (When Attacks) effects." },
      { condition: "Flash", text: "During this turn, give a Spirit +3000 BP." },
    ],
  },
  bs01149AttackShiftRevival: {
    id: "bs01149AttackShiftRevival", format: "Eternal", set: "bs01",
    name: "Attack Shift (Revival)", jpName: "アタックシフト", rarity: "Common",
    type: "magic", color: "white", cost: 7, reduction: 3, symbols: 0, exsymbols: false,
    bp: 0, image: "./assets/cards/Attackshift1.webp", family: [],
    levels: [],
    effects: [
      { condition: "Main", text: "During this turn, the (When Blocks) effects of your Spirits/Ultimates activate at (When Attacks)." },
      { condition: "Flash", text: "During this turn, give a Spirit +10000 BP." },
    ],
  },
  bs01X01TheDragonEmperorSiegfried: {
    id: "bs01X01TheDragonEmperorSiegfried", format: "Eternal", set: "bs01",
    name: "The DragonEmperor Siegfried", jpName: "龍皇ジークフリード", rarity: "X-Rare",
    type: "spirit", color: "red", cost: 6, reduction: 3, symbols: 1, exsymbols: false,
    bp: 4000, image: "./assets/cards/BS01-X01.jpg", family: ["Ancient Dragon"],
    levels: [
      { level: 1, cores: 1, bp: 4000 },
      { level: 2, cores: 2, bp: 6000 },
      { level: 3, cores: 5, bp: 10000 },
    ],
    effects: [
      { condition: "[LV1][LV2][LV3] Flash - Awaken", text: "You can send any number of cores from your Spirits to this Spirit." },
      { condition: "[LV3] When Destroyed", text: "Put a core from the Void to your Life." },
    ],
  },
  bs01X01TheDragonEmperorSiegfriedRevival: {
    id: "bs01X01TheDragonEmperorSiegfriedRevival", format: "Eternal", set: "bs01",
    name: "The DragonEmperor Siegfried (Revival)", jpName: "龍皇ジークフリード", rarity: "X-Rare",
    type: "spirit", color: "red", cost: 6, reduction: 3, symbols: 1, exsymbols: false,
    bp: 4000, image: "./assets/cards/BSC22-X01.jpg", family: ["Ancient Dragon"],
    levels: [
      { level: 1, cores: 1, bp: 4000 },
      { level: 2, cores: 2, bp: 6000 },
      { level: 3, cores: 5, bp: 10000 },
    ],
    effects: [
      { condition: "[LV1][LV2][LV3] Flash - Awaken", text: "You can send any number of cores from your Spirits to this Spirit." },
      { condition: "[LV1][LV2][LV3]", text: "While Soul Core is on this Spirit, it is treated as being on its highest level." },
      { condition: "[LV3] When Destroyed by the Opponent", text: "If your Life is five or less, put two cores from the Void to your Life, and this Spirit remains on the Field in the same state." },
    ],
  },
  bs01X02TheSevenShogunDesperado: {
    id: "bs01X02TheSevenShogunDesperado", format: "Eternal", set: "bs01",
    name: "The SevenShogun Desperado", jpName: "魔界七将デスペラード", rarity: "X-Rare",
    type: "spirit", color: "purple", cost: 8, reduction: 3, symbols: 1, exsymbols: false,
    bp: 6000, image: "./assets/cards/BS01-X02.jpg", family: ["Nightling", "Ogre Wizard"],
    levels: [
      { level: 1, cores: 1, bp: 6000 },
      { level: 2, cores: 4, bp: 9000 },
    ],
    effects: [
      { condition: "[LV1][LV2] When Summoned", text: "Besides this Spirit, send a core each from every Spirit to the owner's Reserve. For each Spirit destroyed by this effect, put a core from the Void to this Spirit." },
      { condition: "[LV2] When Attacks", text: "Send cores from a Spirit to its owner's Reserve until only one core left." },
    ],
  },
  bs01X02TheSevenShogunDesperadoRevival: {
    id: "bs01X02TheSevenShogunDesperadoRevival", format: "Eternal", set: "bs01",
    name: "The SevenShogun Desperado (Revival)", jpName: "魔界七将デスペラード", rarity: "X-Rare",
    type: "spirit", color: "purple", cost: 8, reduction: 3, symbols: 1, exsymbols: false,
    bp: 6000, image: "./assets/cards/BSC22-X02.jpg", family: ["Nightling", "Ogre Wizard"],
    levels: [
      { level: 1, cores: 1, bp: 6000 },
      { level: 2, cores: 4, bp: 9000 },
    ],
    effects: [
      { condition: "[LV1][LV2] When Summoned", text: "Besides this Spirit, send a core each from every Spirit to its owner's Reserve. For each Spirit depleted by this effect, put a core from the Void to this Spirit. If Soul Core was used to pay the summon cost, this effect sends +2 cores each to the opposing Reserve." },
      { condition: "[LV2] When Attacks", text: "Send cores from an opposing Spirit to their Reserve until only one core left." },
    ],
  },
  bs01X03TheDukeKingtaurus: {
    id: "bs01X03TheDukeKingtaurus", format: "Eternal", set: "bs01",
    name: "The Duke Kingtaurus", jpName: "キングタウロス大公", rarity: "X-Rare",
    type: "spirit", color: "green", cost: 8, reduction: 4, symbols: 1, exsymbols: false,
    bp: 4000, image: "./assets/cards/BS01-X03.jpg", family: ["Shell Insect", "Blade Beast"],
    levels: [
      { level: 1, cores: 1, bp: 4000 },
      { level: 2, cores: 3, bp: 6000 },
      { level: 3, cores: 9, bp: 12000 },
    ],
    effects: [
      { condition: "[LV1][LV2][LV3] When Summoned", text: "For each other Spirit you control, put a core from the Void to this Spirit." },
      { condition: "[LV2][LV3] When Attacks", text: "When only the opposing Spirit is destroyed via BP comparison, send an opposing Life to their Reserve." },
    ],
  },
  bs01X03TheDukeKingtaurusRevival: {
    id: "bs01X03TheDukeKingtaurusRevival", format: "Eternal", set: "bs01",
    name: "The Duke Kingtaurus (Revival)", jpName: "キングタウロス大公", rarity: "X-Rare",
    type: "spirit", color: "green", cost: 8, reduction: 4, symbols: 2, exsymbols: false,
    bp: 4000, image: "./assets/cards/BSC22-X03.jpg", family: ["Shell Insect", "Blade Beast"],
    levels: [
      { level: 1, cores: 1, bp: 4000 },
      { level: 2, cores: 3, bp: 12000 },
      { level: 3, cores: 9, bp: 24000 },
    ],
    effects: [
      { condition: "[LV1][LV2][LV3] When Summoned", text: "For each Spirit you control, put a core from the Void to this Spirit." },
      { condition: "[LV2][LV3] When Attacks", text: "When the opposing battling Spirit is depleted/destroyed, send an opposing Life to their Trash. By sending Soul Core from this Spirit to your Reserve, during this battle, Flash effects can't be used by the opponent." },
    ],
  },
  bs01X04TheImpregnableFortressOdin: {
    id: "bs01X04TheImpregnableFortressOdin", format: "Eternal", set: "bs01",
    name: "The ImpregnableFortress Odin", jpName: "要塞皇オーディーン", rarity: "X-Rare",
    type: "spirit", color: "white", cost: 6, reduction: 4, symbols: 1, exsymbols: false,
    bp: 3000, image: "./assets/cards/BS01-X04.jpg", family: ["Machine"],
    levels: [
      { level: 1, cores: 1, bp: 3000 },
      { level: 2, cores: 3, bp: 5000 },
      { level: 3, cores: 6, bp: 8000 },
    ],
    effects: [
      { condition: "[LV1][LV2][LV3]", text: "For each Nexus either player controls, this Spirit gains +1000 BP." },
      { condition: "[LV2][LV3]", text: "All Nexuses can't be destroyed." },
    ],
  },
  bs01X04TheImpregnableFortressOdinRevival: {
    id: "bs01X04TheImpregnableFortressOdinRevival", format: "Eternal", set: "bs01",
    name: "The ImpregnableFortress Odin (Revival)", jpName: "要塞皇オーディーン", rarity: "X-Rare",
    type: "spirit", color: "white", cost: 6, reduction: 4, symbols: 1, exsymbols: false,
    bp: 5000, image: "./assets/cards/BSC22-X04.jpg", family: ["Machine"],
    levels: [
      { level: 1, cores: 1, bp: 5000 },
      { level: 2, cores: 3, bp: 7000 },
      { level: 3, cores: 6, bp: 10000 },
    ],
    effects: [
      { condition: "[LV1][LV2][LV3] When Attacks", text: "By sending Soul Core on this Spirit to your Trash, during this turn, for each Nexus either player controls, a White Spirit you control can't be blocked." },
      { condition: "[LV2][LV3]", text: "This Spirit and all Nexuses are unaffected by opposing Spirit/Ultimate effects." },
    ],
  },
};
