// Set: RP26
export const CARDS_RP26 = {
  rp26TheThunderEmperorDragonSiegwurm: {
    id: "rp26TheThunderEmperorDragonSiegwurm",
    format: "Standard",
    set: "rp26",
    name: "The ThunderEmperorDragon Siegwurm",
    jpName: "雷皇龍ジークヴルム",
    type: "spirit",
    color: "red",
    cost: 6,
    reduction: 3,
    symbols: 1,
    bp: 6000,
    image: "./assets/cards/RP26-01.png",
    family: "Red Cloud, Astral Dragon, Ancient Dragon",
    keyword: "Clash",
    levels: [
      { level: 1, cores: 1, bp: 6000 },
      { level: 2, cores: 4, bp: 9000 },
    ],
    effects: [
      {
        condition: "[LV1-2] Clash - During Attack",
        text: "Opposing Spirits must block if possible.",
      },
      {
        condition: "[LV2] Your Attack Step",
        text: "Give all your \"Red Cloud\" family Spirits Clash.",
      },
    ],
  },
  rp26Proplematis: {
    id: "rp26Proplematis",
    format: "Standard",
    set: "rp26",
    name: "Proplematis",
    jpName: "プロプレマティス",
    type: "spirit",
    color: "green",
    cost: 8,
    reduction: 5,
    symbols: 1,
    bp: 8000,
    image: "./assets/cards/RP26-02.png",
    family: "Oceanic Green, Armored Fish",
    keyword: "Legacy",
    levels: [
      { level: 1, cores: 1, bp: 8000 },
      { level: 2, cores: 3, bp: 10000 },
    ],
    effects: [
      {
        condition: "Legacy",
        text: "You can banish EX Symbols from your Trash for reductions.",
      },
      {
        condition: "[LV2] During Attack - Once Per Turn",
        text: "When only the opposing Spirit is destroyed via BP comparison, this Spirit can refresh.",
      },
    ],
  },
};
