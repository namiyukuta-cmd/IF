// IF 共通モンスターデータ。
// 新規シナリオを作るときは、まずこのファイルを確認し、同じモンスターをシナリオ側へ重複定義しない。
window.DD_MONSTERS = window.DD_MONSTERS || {
  giant_rat: {
    id: 'giant_rat',
    name: 'Giant Rat',
    ja: 'ジャイアント・ラット',
    cr: '1/8',
    ac: 12,
    hp: 7,
    initiativeMod: 2,
    attacks: [
      { name: 'Bite', ja: '噛みつき', toHit: 4, damage: '1d4+2', count: 1 }
    ],
    source: 'mill-at-dawn'
  },
  deep_scion: {
    id: 'deep_scion',
    name: 'Deep Scion',
    cr: 3,
    ac: 11,
    hp: 67,
    initiativeMod: 1,
    attacks: [
      { name: 'Bite', toHit: 6, damage: '1d4+4', count: 1 },
      { name: 'Claw', toHit: 6, damage: '1d6+4', count: 2 }
    ],
    special: { kind: 'screech', name: 'Psychic Screech', saveAbility: 'wis', dc: 13, once: true },
    source: 'frozen-offerings'
  },
  yeti: {
    id: 'yeti',
    name: 'Yeti',
    cr: 3,
    ac: 12,
    hp: 51,
    initiativeMod: 1,
    attacks: [
      { name: 'Claw', toHit: 6, damage: '1d6+4+1d6', count: 2 }
    ],
    special: { kind: 'gaze', name: 'Chilling Gaze', saveAbility: 'con', dc: 13, damage: '3d6', oncePerTarget: true },
    fearOfFire: true,
    source: 'frozen-offerings'
  },
  young_white_dragon: {
    id: 'young_white_dragon',
    name: 'Young White Dragon',
    cr: 6,
    ac: 17,
    hp: 133,
    initiativeMod: 0,
    attacks: [
      { name: 'Bite', toHit: 7, damage: '2d10+4+1d8', count: 1 },
      { name: 'Claw', toHit: 7, damage: '2d6+4', count: 2 }
    ],
    breath: { name: 'Cold Breath', saveAbility: 'con', dc: 15, damage: '10d8', recharge: [5, 6], firstRound: true },
    source: 'frozen-offerings'
  }
};

window.DDMonsterData = window.DD_MONSTERS;
