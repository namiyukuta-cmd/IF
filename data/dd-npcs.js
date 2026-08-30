// IF NPCデータカタログ。
// 新規シナリオを作るときは、既存NPCの再利用・参照が必要か先にここを確認する。
// シナリオ固有NPCも所在を探しやすくするため登録するが、別シナリオへ無断流用しない。
window.DD_NPCS = window.DD_NPCS || {
  NPC_THALGAR: {
    id: 'NPC_THALGAR',
    name: 'Thalgar',
    role: 'sidekick',
    notes: 'Malgarの兄。PCと同行する。',
    sourceScenario: 'frozen-offerings'
  },
  NPC_MALGAR: {
    id: 'NPC_MALGAR',
    name: 'Malgar',
    role: 'rescue-target',
    notes: 'Brukka族に捕らえられ、白竜への生贄として連行された。',
    sourceScenario: 'frozen-offerings'
  },
  NPC_UTRIRR: {
    id: 'NPC_UTRIRR',
    name: 'Utrirr',
    role: 'captain',
    notes: 'Auroraの船長。',
    sourceScenario: 'frozen-offerings'
  },
  NPC_GHUDVIL: {
    id: 'NPC_GHUDVIL',
    name: 'Chief Ghudvil',
    role: 'brukka-chief',
    notes: 'Brukka村の族長。',
    sourceScenario: 'frozen-offerings'
  },
  NPC_HALE: {
    id: 'NPC_HALE',
    name: 'Hale',
    role: 'miller',
    notes: 'Brackenfordの粉屋。水車小屋で救出対象になる。',
    sourceScenario: 'mill-at-dawn'
  },
  NPC_MIRA: {
    id: 'NPC_MIRA',
    name: 'Mira',
    role: 'baker',
    notes: 'Brackenfordのパン屋。夜明けの水車小屋の依頼人。',
    sourceScenario: 'mill-at-dawn'
  }
};

window.DDNpcData = window.DD_NPCS;
